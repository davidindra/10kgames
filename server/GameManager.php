<?php
require_once 'Game.php';
require_once 'WebSocketServer.php';

class GameManager{
    /**
     * @var Game[]
     */
    private $games = [];

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

    public function startGame(Game $game){
        $game->setWebSocketServer($this->webSocketServer);
        $this->games[] = $game;
        $game->startGame();
    }

    public function processMessage($sid, $msg){
        foreach($this->games as $game){
            if($game->getPlayerOne()->getSid() == $sid || $game->getPlayerTwo()->getSid() == $sid){
                $game->processMessage($sid, $msg);
                return true;
            }
        }
        return false;
    }

    public function endGame($sid){
        foreach($this->games as $game){
            if($game->getPlayerOne()->getSid() == $sid || $game->getPlayerTwo()->getSid() == $sid){
                $game->endGame($sid);
                return true;
            }
        }
        return false;
    }
}