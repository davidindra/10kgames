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

    private $state;

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

    /**
     * @return mixed
     */
    public function getState()
    {
        return $this->state;
    }

    /**
     * @param mixed $state
     */
    public function setState($state)
    {
        $this->state = $state;
    }
}