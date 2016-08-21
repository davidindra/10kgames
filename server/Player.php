<?php

class Player{
    public function __construct($sid, $ip)
    {
        $this->sid = $sid;
        $this->ip = $ip;
        $this->username = 'kilobyte' . mt_rand(100, 999);
    }

    private $sid;

    /**
     * @return string
     */
    public function getSid()
    {
        return $this->sid;
    }

    private $ip;

    /**
     * @return string
     */
    public function getIp()
    {
        return $this->ip;
    }

    private $username;

    /**
     * @return string
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * @param string $username
     */
    public function setUsername($username)
    {
        $this->username = $username;
    }

    private $score = 0;

    /**
     * @param int $score
     */
    public function addScore($score)
    {
        $this->score += $score;
    }

    /**
     * @return int
     */
    public function getScore()
    {
        return $this->score;
    }
}