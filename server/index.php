<?php
require 'WebSocketServer.php';
require 'ClientManager.php';

echo 'Welcome in 10kGames WebSocket server!' . PHP_EOL;

$clientManager = new ClientManager(); // create instance of class which
$server = new WebSocketServer($clientManager);
$clientManager->setWebSocketServer($server);
$server->run();
