<?php
require 'ws-game.php';

$host = 'localhost'; //host
$port = '9000'; //port
$null = NULL; //null var

//Create TCP/IP sream socket
$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
//reuseable port
socket_set_option($socket, SOL_SOCKET, SO_REUSEADDR, 1);

//bind socket to specified host
socket_bind($socket, 0, $port);

//listen to port
socket_listen($socket);

//create & add listning socket to the list
$clients = array(0 => $socket);

//start endless loop, so that our script doesn't stop
while (true) {
    //manage multiple connections
    $changed = array_values($clients);

    //returns the socket resources in $changed array
    socket_select($changed, $null, $null, 0, 10);

    /*foreach($changed as $sock) {
        if (($key = array_search($sock, $clients)) !== false) {
            $clients[$key] = $sock;
        }else{
            $clients[mt_rand(1, 9999999)] = $sock;
        }
    }*/

    //check for new socket
    if (in_array($socket, $changed)) {
        $rid = mt_rand(1, 9999999);
        $clients[$rid] = socket_accept($socket); //add socket to client array

        $header = socket_read($clients[$rid], 1024); //read data sent by the socket
        perform_handshaking($header, $clients[$rid], $host, $port); //perform websocket handshake

        client_new($rid);

        //make room for new socket
        unset($changed[array_search($socket, $changed)]);
    }

    //loop through all connected sockets
    foreach ($changed as $changed_socket) {

        //check for any incomming data
        while(socket_recv($changed_socket, $buf, 1024, 0) >= 1)
        {
            if(($key = array_search($changed_socket, $clients)) !== false) {
                $msg = message($key, json_decode(unmask($buf), true));
                if($msg === false){ // we wanna die
                    client_died($key);
                    unset($clients[$key]);
                }elseif($msg !== true){ // SID setting
                    $sock = $clients[$key];
                    unset($clients[$key]);
                    $clients[$msg] = $sock;
                }
            }
            break 2; //exist this loop
        }

        $buf = @socket_read($changed_socket, 1024, PHP_NORMAL_READ);
        if ($buf === false) { // check disconnected client
            // remove client for $clients array
            $found_socket = array_search($changed_socket, array_values($clients));
            if(($key = array_search($found_socket, $clients)) !== false) {
                client_died($key);
                unset($clients[$key]);
            }
        }
    }
}
// close the listening socket
socket_close($socket);

function send_message($msg, $sid = null)
{
    global $clients;
    if(empty($sid)) {
        foreach (array_values($clients) as $changed_socket) {
            @socket_write($changed_socket, mask(json_encode($msg, strlen($msg))));
        }
    }else{
        @socket_write($clients[$sid], mask(json_encode($msg, strlen($msg))));
    }
    return true;
}


//Unmask incoming framed message
function unmask($text) {
    $length = ord($text[1]) & 127;
    if($length == 126) {
        $masks = substr($text, 4, 4);
        $data = substr($text, 8);
    }
    elseif($length == 127) {
        $masks = substr($text, 10, 4);
        $data = substr($text, 14);
    }
    else {
        $masks = substr($text, 2, 4);
        $data = substr($text, 6);
    }
    $text = "";
    for ($i = 0; $i < strlen($data); ++$i) {
        $text .= $data[$i] ^ $masks[$i%4];
    }
    return $text;
}

//Encode message for transfer to client.
function mask($text)
{
    $b1 = 0x80 | (0x1 & 0x0f);
    $length = strlen($text);

    if($length <= 125)
        $header = pack('CC', $b1, $length);
    elseif($length > 125 && $length < 65536)
        $header = pack('CCn', $b1, 126, $length);
    else
        $header = pack('CCNN', $b1, 127, $length);
    return $header.$text;
}

//handshake new client.
function perform_handshaking($receved_header,$client_conn, $host, $port)
{
    $headers = array();
    $lines = preg_split("/\r\n/", $receved_header);
    foreach($lines as $line)
    {
        $line = chop($line);
        if(preg_match('/\A(\S+): (.*)\z/', $line, $matches))
        {
            $headers[$matches[1]] = $matches[2];
        }
    }

    $secKey = $headers['Sec-WebSocket-Key'];
    $secAccept = base64_encode(pack('H*', sha1($secKey . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')));
    //hand shaking header
    $upgrade  = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" .
        "Upgrade: websocket\r\n" .
        "Connection: Upgrade\r\n" .
        "WebSocket-Origin: $host\r\n" .
        "WebSocket-Location: ws://$host:$port/\r\n".
        "Sec-WebSocket-Accept:$secAccept\r\n\r\n";
    socket_write($client_conn,$upgrade,strlen($upgrade));
}