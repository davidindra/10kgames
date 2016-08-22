<?php
echo 'Welcome in 10kGames WebSocket server!' . PHP_EOL;

require_once 'ClientManager.php'; // loads all classes

// ClientManager
$clientManager = new ClientManager(); // ClientManager routes it all

// PlayerManager
$playerManager = new PlayerManager(); // holds an array of all live players
$clientManager->setPlayerManager($playerManager); // ClientManager needs access to a list of all players

// Queue
$queue = new Queue(); // queue of waiting players
$clientManager->setQueue($queue); // ClientManager needs access to queue for adding new members into it

// GameManager
$gameManager = new GameManager(); // GameManager manages all running games
$queue->setGameManager($gameManager); // Queue creates games

// WebSocketServer
$server = new WebSocketServer($clientManager); // WebSocketServer works with raw data coming from players
//$clientManager->setWebSocketServer($server); // ClientManager takes all the requests and routes it
//$gameManager->setWebSocketServer($server); // GameManager needs to send messages to players

class Res{ /** @var WebSocketServer */
      public static $wss;
      public static function wss(){return self::$wss;} } // really stupid static class for supplying WebSocketServer

Res::$wss = $server;

$server->run(); // launch an infinite loop
