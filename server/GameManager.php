<?php
require_once 'Game.php';

class GameManager{
    /**
     * @var Game[]
     */
    private $games = [];

    public function findGame($sid){
        foreach($this->games as $game){
            if($game->getPlayerOne()->getSid() == $sid || $game->getPlayerTwo()->getSid() == $sid){
                return $game;
            }
        }
        return false;
    }

    public function startGame(Game $game){
        $this->games[] = $game;
        $game->startGame();
    }

    public function processMessage($sid, $msg){
        if($game = $this->findGame($sid)) {
            return $game->processMessage($sid, $msg);
        }
        return false;
    }

    public function endGame($sid){
        if($game = $this->findGame($sid)) {
            $game->endGame($sid);
            return true;
        }
        return false;
    }
}