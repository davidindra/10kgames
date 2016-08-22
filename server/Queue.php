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

    public function removeMember($sid){
        foreach($this->queue as $key => $queueMember){
            if($queueMember->getPlayer()->getSid() == $sid){
                unset($this->queue[$key]);
            }
        }
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

    public function findMember($sid){
        foreach($this->queue as $key => $queueMember){
            if($queueMember->getPlayer()->getSid() == $sid){
                return $this->queue[$key];
            }
        }
        return false;
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

                $playerOne = $sortedMembers[$queueMember->getGame()]->getPlayer();
                $playerTwo = $queueMember->getPlayer();
                Res::wss()->send(
                    [
                        'event' => 'gameready',
                        'gamename' => $queueMember->getGame(),
                        'side' => 'left',
                        'opponent' =>
                            [
                                'username' => $playerTwo->getUsername(),
                                'overallscore' => $playerTwo->getScore()
                            ],
                        'state' => 'ok'
                    ],
                    $playerOne->getSid()
                );

                Res::wss()->send(
                    [
                        'event' => 'gameready',
                        'gamename' => $queueMember->getGame(),
                        'side' => 'right',
                        'opponent' =>
                            [
                                'username' => $playerOne->getUsername(),
                                'overallscore' => $playerOne->getScore()
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