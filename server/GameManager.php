<?php
require_once 'Game.php';

class GameManager{
    /**
     * @var Game[]
     */
    private $games = [];

    public function startGame(Game $game){
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