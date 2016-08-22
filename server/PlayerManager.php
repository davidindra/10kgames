<?php
require_once 'Player.php';

class PlayerManager{
    /**
     * @var Player[]
     */
    private $players;

    public function addPlayer(Player $player){
        $this->players[] = $player;
    }

    public function findPlayer($sid){
        foreach($this->players as $player){
            if($player->getSid() == $sid){
                return $player;
            }
        }
        return false;
    }

    public function removePlayer($sid){
        foreach($this->players as $key => $player){
            if($player->getSid() == $sid){
                unset($this->players[$key]);
                return true;
            }
        }
        return false;
    }

    public function playersCount(){
        return count($this->players);
    }
}