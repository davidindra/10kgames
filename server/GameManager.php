<?php
require_once 'Game.php';
require_once 'WebSocketServer.php';

class GameManager{
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
}