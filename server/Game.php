<?php
require_once 'Player.php';

class Game{
    /**
     * @var string
     */
    private $type;
    /**
     * @var Player
     */
    private $playerOne;
    /**
     * @var Player
     */
    private $playerTwo;

    /**
     * @var mixed
     */
    public $state;

    /**
     * Game constructor.
     * @param string $type
     * @param Player $playerOne
     * @param Player $playerTwo
     */
    public function __construct($type, Player $playerOne, Player $playerTwo)
    {
        $this->type = $type;
        $this->playerOne = $playerOne;
        $this->playerTwo = $playerTwo;
    }

    /**
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @return Player
     */
    public function getPlayerOne()
    {
        return $this->playerOne;
    }

    /**
     * @return Player
     */
    public function getPlayerTwo()
    {
        return $this->playerTwo;
    }

    public function startGame(){
        Res::wss()->send(
            [
                'event' => 'gameready',
                'gamename' => $this->type,
                'side' => 'left',
                'opponent' =>
                    [
                        'username' => $this->playerTwo->getUsername(),
                        'overallscore' => $this->playerTwo->getScore()
                    ],
                'state' => 'ok'
            ],
            $this->playerOne->getSid()
        );

        Res::wss()->send(
            [
                'event' => 'gameready',
                'gamename' => $this->type,
                'side' => 'right',
                'opponent' =>
                    [
                        'username' => $this->playerOne->getUsername(),
                        'overallscore' => $this->playerOne->getScore()
                    ],
                'state' => 'ok'
            ],
            $this->playerTwo->getSid()
        );
    }

    public function processMessage($sid, $msg){
        // todo
    }

    public function endGame($sid){
        // todo
    }
}
