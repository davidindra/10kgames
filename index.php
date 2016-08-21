<?php
session_start();

if(isset($_GET['ws'])){ // we wanna launch WebSocket server
    require 'server/loader.php';
}else{
    require 'frontend/loader.php';
}

die();
