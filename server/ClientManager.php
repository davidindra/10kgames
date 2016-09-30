<?php
require_once 'WebSocketServer.php';
require_once 'PlayerManager.php';
require_once 'Queue.php';

class ClientManager implements IClientManager{
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

        Res::wss()->send(
            [
                'username' => $player->getUsername(),
                'playerscount' => $this->playerManager->playersCount() - 1,
                'state' => 'connected'
            ],
            $sid
        );

        echo 'NEW: ' . $ip . ' (' . $sid . ')' . PHP_EOL;
    }

    public function clientDied($sid)
    {
        Res::wss()->send(['state' => 'disconnected'], $sid);

        $this->queue->removeMember($sid);
        $this->playerManager->removePlayer($sid);

        echo 'DIE: ' . $sid . PHP_EOL;
    }

    public function message($sid, $msg)
    {
        $response = ['event' => @$msg['event']];
        switch(@strtolower(@$msg['event'])){
            case 'disconnect':
                return false;
            case 'changename':
                if(!isset($msg['newname'])){
                    $response['error'] = 'newname missing';
                    $response['state'] = 'error';
                    Res::wss()->send($response, $sid);
                    break;
                }

                $this->playerManager->findPlayer($sid)->setUsername(@$msg['newname']);
                $response['newname'] = $msg['newname'];
                $response['state'] = 'ok';
                Res::wss()->send($response, $sid);
                break;
            case 'queue':
                if(!isset($msg['gamename'])){
                    $response['error'] = 'gamename missing';
                    $response['state'] = 'error';
                    Res::wss()->send($response, $sid);
                    break;
                }
                if($msg['gamename'] != 'blocks' /*&& $msg['gamename'] != 'snake'*/){
                    $response['error'] = 'unknown gamename - allowed are just blocks';
                    $response['state'] = 'error';
                    Res::wss()->send($response, $sid);
                    break;
                }

                if($this->queue->findMember($sid)){
                    $response['error'] = 'already in a queue';
                    $response['state'] = 'error';
                    Res::wss()->send($response, $sid);
                    break;
                }elseif($this->queue->findGame($sid)){
                    $response['error'] = 'already in a game';
                    $response['state'] = 'error';
                    Res::wss()->send($response, $sid);
                    break;
                }

                $queueMember = new QueueMember($this->playerManager->findPlayer($sid), $msg['gamename']);
                $response['nth'] = $this->queue->add($queueMember);
                $response['state'] = 'ok';
                Res::wss()->send($response, $sid);

                $this->queue->match();
                break;
            case 'queueleave':
                if($this->queue->removeMember($sid)) {
                    $response['state'] = 'ok';
                }else{
                    $response['error'] = 'not in a queue';
                    $response['state'] = 'error';
                }
                Res::wss()->send($response, $sid);
                break;
            case 'game':
                if(!$this->queue->processMessage($sid, $msg)) {
                    $response['error'] = 'not in a game';
                    $response['state'] = 'error';
                    Res::wss()->send($response, $sid);
                }

                break;
            case 'logout':
                $this->queue->stopGames($sid);
                break;
            default:
                $response['error'] = 'unknown command';
                $response['state'] = 'error';
                Res::wss()->send($response, $sid);
        }

        echo 'MSG: ' . $sid . ': ' . json_encode($msg) . PHP_EOL;

        return true;
    }
}