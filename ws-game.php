<?php
function client_new($rid){
    global $clients;
    socket_getpeername($clients[$rid], $ip); //get ip address of connected socket
    echo 'NEW: ' . $ip . ' (' . $rid . ')' . PHP_EOL;
}

function client_died($sid){
    echo 'DIE: ' . $sid . PHP_EOL;
}

function message($sid, $data){
    echo 'MSG: ' . $sid . ': ' . json_encode($data) . PHP_EOL;

    if(isset($data['end'])){
        return false;
    }

    // something

    if(isset($data['sid'])){
        return $data['sid'];
    }

    return true;
}