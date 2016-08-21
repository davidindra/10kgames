<?php
require_once 'WebSocketServer.php';

echo 'Welcome in 10kGames WebSocket server!' . PHP_EOL;

$clientManager = new ClientManager();

$playerManager = new PlayerManager();
$clientManager->setPlayerManager($playerManager);

$queue = new Queue();
$clientManager->setQueue($queue);


$server = new WebSocketServer($clientManager);

$clientManager->setWebSocketServer($server);

$server->run();
