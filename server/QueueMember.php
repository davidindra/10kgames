<?php
require_once 'Player.php';

class QueueMember{
    /**
     * @var Player
     */
    private $player;
    /**
     * @var string game name
     */
    private $game;
    /**
     * @var int timestamp of request start
     */
    private $requestTime;

    /**
     * QueueMember constructor.
     * @param Player $player
     * @param string $game
     */
    public function __construct($player, $game)
    {
        $this->player = $player;
        $this->game = $game;
        $this->requestTime = time();
    }

    /**
     * @return Player
     */
    public function getPlayer()
    {
        return $this->player;
    }

    /**
     * @return string
     */
    public function getGame()
    {
        return $this->game;
    }

    /**
     * @return int
     */
    public function getRequestTime()
    {
        return $this->requestTime;
    }
}