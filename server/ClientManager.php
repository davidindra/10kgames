<?php
require_once 'WebSocketServer.php';
require_once 'PlayerManager.php';
require_once 'Queue.php';

class ClientManager implements IClientManager{
    /**
     * @var WebSocketServer
     */
    private $webSocketServer;

    /**
     * @param WebSocketServer $webSocketServer
     */
    public function setWebSocketServer(WebSocketServer $webSocketServer)
    {
        $this->webSocketServer = $webSocketServer;
    }

    /**
     * @var PlayerManager
     */
    private $playerManager;

    /**
     * @param PlayerManager $playerManager
     */
    public function setPlayerManager(PlayerManager $playerManager)
    {
        $this->playerManager = $playerManager;
    }

    /**
     * @var Queue
     */
    private $queue;

    /**
     * @param Queue $queue
     */
    public function setQueue($queue)
    {
        $this->queue = $queue;
    }

    public function clientNew($sid, $ip)
    {
        $player = new Player($sid, $ip);
        $this->playerManager->addPlayer($player);

        $this->webSocketServer->send(['username' => $player->getUsername(), 'state' => 'connected'], $sid);

        echo 'NEW: ' . $ip . ' (' . $sid . ')' . PHP_EOL;
    }

    public function clientDied($sid)
    {
        $this->webSocketServer->send(['state' => 'disconnected'], $sid);

        $this->queue->removeMember($sid);
        $this->playerManager->removePlayer($sid);
        // TODO: stop running games!

        echo 'DIE: ' . $sid . PHP_EOL;
    }

    public function message($sid, $msg)
    {
        echo 'MSG: ' . $sid . ': ' . json_encode($msg) . PHP_EOL;

        $response = ['event' => @$msg['event']];
        switch(@strtolower(@$msg['event'])){
            case 'disconnect':
                return false;
            case 'changename':
                $this->playerManager->findPlayer($sid)->setUsername(@$msg['newname']);
                $response['newname'] = @$msg['newname'];
                $response['state'] = 'ok';
                $this->webSocketServer->send($response, $sid);
                break;
            case 'queue': // TODO: validate game names!
                if($this->queue->findMember($sid)){
                    $response['error'] = 'already in a queue';
                    $response['state'] = 'error';
                    $this->webSocketServer->send($response, $sid);
                    break;
                }

                $queueMember = new QueueMember($this->playerManager->findPlayer($sid), $msg['gametype']);
                $response['nth'] = $this->queue->add($queueMember);
                $response['state'] = 'ok';
                $this->webSocketServer->send($response, $sid);

                $this->queue->match($this->webSocketServer); // TODO: socketserver won't be neccessary
                break;
            case 'game':
                $response['state'] = 'TODO';
                $this->webSocketServer->send($response, $sid);

                break;
            default:
                $response['state'] = 'unknown';
                $this->webSocketServer->send($response, $sid);
        }

        return true;
    }
}