<?php
require_once 'QueueMember.php';

class Queue{
    /**
     * @var QueueMember[]
     */
    private $queue = [];

    public function removeMember($sid){
        foreach($this->queue as $key => $queueMember){
            if($queueMember->getPlayer()->getSid() == $sid){
                unset($this->queue[$key]);
            }
        }
    }

    public function add(QueueMember $newQueueMember){
        $this->queue[] = $newQueueMember;
        /*$nth = 0;
        foreach($this->queue as $queueMember){
            if($queueMember->getGame() == $newQueueMember->getGame()){
                $nth++;
            }
        }
        return $nth;*/
        return count($this->queue);
    }

    public function findMember($sid){
        foreach($this->queue as $key => $queueMember){
            if($queueMember->getPlayer()->getSid() == $sid){
                return $this->queue[$key];
            }
        }
        return false;
    }

    public function match(WebSocketServer $webSocketServer){ // TODO: nebudeme potrebovat - zpravy se premisti do Game
        $sortedMembers = array();
        foreach ($this->queue as $queueMember) {
            if(isset($sortedMembers[$queueMember->getGame()])){
                $playerOne = $sortedMembers[$queueMember->getGame()]->getPlayer();
                $playerTwo = $queueMember->getPlayer();
                $webSocketServer->send(
                    [
                        'event' => 'gameready',
                        'gamename' => $queueMember->getGame(),
                        'side' => 'left',
                        'opponent' =>
                            [
                                'username' => $playerTwo->getUsername(),
                                'overallscore' => 574 // TODO score!
                            ],
                        'state' => 'ok'
                    ],
                    $playerOne->getSid()
                );

                $webSocketServer->send(
                    [
                        'event' => 'gameready',
                        'gamename' => $queueMember->getGame(),
                        'side' => 'right',
                        'opponent' =>
                            [
                                'username' => $playerOne->getUsername(),
                                'overallscore' => 323 // TODO score!
                            ],
                        'state' => 'ok'
                    ],
                    $playerTwo->getSid()
                );

                $this->removeMember($playerOne->getSid());
                $this->removeMember($playerTwo->getSid());
            }else{
                $sortedMembers[$queueMember->getGame()] = $queueMember;
            }
        }
    }
}