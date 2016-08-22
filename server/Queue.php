<?php
require_once 'QueueMember.php';
require_once 'GameManager.php';

class Queue{
    /**
     * @var QueueMember[]
     */
    private $queue = [];

    /**
     * @var GameManager
     */
    private $gameManager;

    /**
     * @param GameManager $gameManager
     */
    public function setGameManager(GameManager $gameManager)
    {
        $this->gameManager = $gameManager;
    }

    public function findMember($sid){
        foreach($this->queue as $key => $queueMember){
            if($queueMember->getPlayer()->getSid() == $sid){
                return $this->queue[$key];
            }
        }
        return false;
    }

    public function removeMember($sid){
        foreach($this->queue as $key => $queueMember){
            if($queueMember->getPlayer()->getSid() == $sid){
                unset($this->queue[$key]);
                return true;
            }
        }
        return false;
    }

    public function findGame($sid){
        return $this->gameManager->findGame($sid);
    }

    public function stopGames($sid){
        $this->gameManager->endGame($sid);
    }

    public function add(QueueMember $newQueueMember){
        $this->queue[] = $newQueueMember;

        $nth = count($this->queue);
        switch($nth){
            case 1:
                return '1st';
            case 2:
                return '2nd';
            case 3:
                return '3rd';
            default:
                return $nth . 'th';
        }
    }

    public function match(){
        $sortedMembers = array();
        foreach ($this->queue as $queueMember) {
            if(isset($sortedMembers[$queueMember->getGame()])){
                $game = new Game(
                    $queueMember->getGame(),
                    $sortedMembers[$queueMember->getGame()]->getPlayer(),
                    $queueMember->getPlayer()
                );
                $this->gameManager->startGame($game);

                $this->removeMember($sortedMembers[$queueMember->getGame()]->getPlayer()->getSid());
                $this->removeMember($queueMember->getPlayer()->getSid());
            }else{
                $sortedMembers[$queueMember->getGame()] = $queueMember;
            }
        }
    }

    public function processMessage($sid, $msg){
        return $this->gameManager->processMessage($sid, $msg);
    }
}