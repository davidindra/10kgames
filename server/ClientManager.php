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

        switch(@strtolower(@$msg['event'])){
            case 'disconnect':
                return false;
            case 'changename':
                $this->playerManager->getPlayer($sid)->setUsername($msg['newname']);
                $this->webSocketServer->send(['state' => 'ok'], $sid);
                break;
            case 'queue':
                $queueMember = new QueueMember($this->playerManager->getPlayer($sid), $msg['gametype']);
                $nth = $this->queue->add($queueMember);
                $this->webSocketServer->send(['nth' => $nth, 'state' => 'ok'], $sid);

                $this->queue->match($this->webSocketServer);
                break;
            default:
                $this->webSocketServer->send(['state' => 'unknown'], $sid);
        }

        return true;
    }
}