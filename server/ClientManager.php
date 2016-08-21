<?php

class ClientManager implements IClientManager{
    /**
     * @var WebSocketServer
     */
    private $webSocketServer;

    public function setWebSocketServer(WebSocketServer $webSocketServer)
    {
        $this->webSocketServer = $webSocketServer;
    }

    public function clientNew($sid, $ip)
    {
        $this->webSocketServer->send(['state' => 'connected'], $sid);
        echo 'NEW: ' . $ip . ' (' . $sid . ')' . PHP_EOL;
    }

    public function clientDied($sid)
    {
        $this->webSocketServer->send(['state' => 'disconnected'], $sid);
        echo 'DIE: ' . $sid . PHP_EOL;
    }

    public function message($sid, $msg)
    {
        echo 'MSG: ' . $sid . ': ' . json_encode($msg) . PHP_EOL;

        switch(@$msg['state']){
            case 'disconnect':
                return false;
            case 'helloworld':
                $this->webSocketServer->send(['hello' => 'world!'], $sid);
                break;
            default:
                $this->webSocketServer->send(['state' => 'unknown'], $sid);
        }

        return true;
    }
}