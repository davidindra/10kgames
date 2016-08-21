<?php

class Player{
    private $sid;
    private $ip;
    private $username;

    public function __construct($sid, $ip)
    {
        $this->sid = $sid;
        $this->ip = $ip;
        $this->username = 'kilobyte' . mt_rand(100, 999);
    }

    /**
     * @return mixed
     */
    public function getSid()
    {
        return $this->sid;
    }

    /**
     * @return mixed
     */
    public function getIp()
    {
        return $this->ip;
    }

    /**
     * @return mixed
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * @param mixed $username
     */
    public function setUsername($username)
    {
        $this->username = $username;
    }
}