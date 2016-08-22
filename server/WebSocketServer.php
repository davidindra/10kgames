<?php
require_once 'ClientManager.php';

/**
 * Class WebSocketServer establishes a WebSocket server and maintains connecting clients
 */
class WebSocketServer
{
    /**
     * @var string hostname
     */
    private $host;

    /**
     * @var string port
     */
    private $port;

    /**
     * @var IClientManager client manager
     */
    private $clientManager;

    /**
     * @var array array with SID as keys and sockets as a values
     */
    private $clients;

    /**
     * WebSocketServer constructor. Sets connection details
     * @param IClientManager $clientManager client manager
     * @param string $host hostname
     * @param string $port port
     */
    public function __construct(IClientManager $clientManager, $host = 'localhost', $port = '9000')
    {
        $this->host = $host;
        $this->port = $port;
        $this->clientManager = $clientManager;
    }

    /**
     * Main function maintaining the WebSocket server's successful infinite run
     * @return void
     */
    public function run()
    {
        $null = null; // IDE highlighting

        $socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP); // create TCP/IP stream socket
        socket_set_option($socket, SOL_SOCKET, SO_REUSEADDR, 1); // set port as reusable
        socket_bind($socket, 0, $this->port); //bind our socket to specified port
        socket_listen($socket); // listen to that port

        $this->clients = array(0 => $socket); // add our listening socket to the list of clients

        while (true) { // process forever
            try {
                $changed = array_values($this->clients); // manage multiple connections
                socket_select($changed, $null, $null, 0, 10); // return socket resources into $changed[]

                if (in_array($socket, $changed)) { // check for new socket connection
                    $rid = mt_rand(1, 9999999); // generate new random ID for the socket
                    $this->clients[$rid] = socket_accept($socket); //add socket to clients array
                    $header = socket_read($this->clients[$rid], 1024); //read data sent by the socket
                    $this->perform_handshaking($header, $this->clients[$rid]); //perform websocket handshake
                    socket_getpeername($this->clients[$rid], $ip);
                    $this->clientManager->clientNew($rid, $ip); // process the information about new client to the client manager
                    unset($changed[array_search($socket, $changed)]); //make room for new socket
                }

                foreach ($changed as $changed_socket) { //loop through all connected sockets
                    while (socket_recv($changed_socket, $buf, 1024, 0) >= 1) { //check for any incoming data
                        if (($key = array_search($changed_socket, $this->clients)) !== false) { // get SID of this user
                            $unmasked = $this->unmask($buf);

                            if (preg_match_all("/({.*})/", $unmasked, $array)){
                                $unmasked = $array[1][0];
                            }else{
                                $unmasked = '';
                            }

                            echo 'DBG: ' . $unmasked . PHP_EOL;
                            $msg = $this->clientManager->message($key, json_decode($unmasked, true)); // process the message
                            if ($msg == false) { // client requested end of the session
                                $this->clientManager->clientDied($key); // manage client's disconnection
                                unset($this->clients[$key]); // remove from array of clients
                            } else {
                                // nothing happens - connection continue
                            }
                        }
                        break 2; //exit this loop & start over
                    }

                    $buf = @socket_read($changed_socket, 1024, PHP_NORMAL_READ); // read buffer
                    if ($buf === false) { // client disconnected
                        $found_socket = array_search($changed_socket, array_values($this->clients)); // find socket in clients array
                        if (($key = array_search($found_socket, $this->clients)) !== false) { // find client's SID
                            $this->clientManager->clientDied($key); // manage disconnection of client with this SID
                            unset($this->clients[$key]); // remove client from client's array
                        }
                    }
                }
            } catch (Exception $e) {
                echo 'FATAL: ' . $e->getMessage() . ' (' . $e->getFile() . ':' . $e->getLine() . ')' . PHP_EOL;
            }
        }

        socket_close($socket); // close listening socket
    }

    /**
     * Send WebSocket message $msg to user with SID $sid
     * @param array $msg message prepared for JSON encoding
     * @param string $sid user's SID
     * @return true
     */
    public function send($msg, $sid = null)
    {
        if (empty($sid)) {
            foreach (array_values($this->clients) as $changed_socket) {
                @socket_write($changed_socket, $this->mask(json_encode($msg, strlen($msg))));
            }
        } else {
            @socket_write($this->clients[$sid], $this->mask(json_encode($msg, strlen($msg))));
        }
        return true;
    }

    /**
     * Unmask incoming framed message
     * @param string $text
     * @return string
     */
    private function unmask($text)
    {
        $length = ord($text[1]) & 127;
        if ($length == 126) {
            $masks = substr($text, 4, 4);
            $data = substr($text, 8);
        } elseif ($length == 127) {
            $masks = substr($text, 10, 4);
            $data = substr($text, 14);
        } else {
            $masks = substr($text, 2, 4);
            $data = substr($text, 6);
        }
        $text = "";
        for ($i = 0; $i < strlen($data); ++$i) {
            $text .= $data[$i] ^ $masks[$i % 4];
        }
        return $text;
    }

    /**
     * Encode message for transfer to client.
     * @param string $text
     * @return string
     */
    private function mask($text)
    {
        $b1 = 0x80 | (0x1 & 0x0f);
        $length = strlen($text);

        if ($length <= 125)
            $header = pack('CC', $b1, $length);
        elseif ($length > 125 && $length < 65536)
            $header = pack('CCn', $b1, 126, $length);
        else
            $header = pack('CCNN', $b1, 127, $length);
        return $header . $text;
    }

    /**
     * Do a handshake with new client
     * @param string $receved_header headers
     * @param resource $client_conn connection to client
     * @return void
     */
    private function perform_handshaking($receved_header, $client_conn)
    {
        $headers = array();
        $lines = preg_split("/\r\n/", $receved_header);
        foreach ($lines as $line) {
            $line = chop($line);
            if (preg_match('/\A(\S+): (.*)\z/', $line, $matches)) {
                $headers[$matches[1]] = $matches[2];
            }
        }

        $secKey = $headers['Sec-WebSocket-Key'];
        $secAccept = base64_encode(pack('H*', sha1($secKey . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')));
        //hand shaking header
        $upgrade = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" .
            "Upgrade: websocket\r\n" .
            "Connection: Upgrade\r\n" .
            "WebSocket-Origin: $this->host\r\n" .
            "WebSocket-Location: ws://$this->host:$this->port/\r\n" .
            "Sec-WebSocket-Accept:$secAccept\r\n\r\n";
        socket_write($client_conn, $upgrade, strlen($upgrade));
    }
}

/**
 * Interface IClientManager defines a class, which receives and handles messages from clients
 */
interface IClientManager
{
    /**
     * New client is connected
     * @param int $sid session ID
     * @param string $ip client's IP address
     * @return void
     */
    public function clientNew($sid, $ip);

    /**
     * Client ended the connection
     * @param int $sid session ID
     * @return void
     */
    public function clientDied($sid);

    /**
     * New message from client arrived
     * @param int $sid session ID
     * @param array $msg JSON message
     * @return bool true when we want the connection to continue, false when we want to end it
     */
    public function message($sid, $msg);
}