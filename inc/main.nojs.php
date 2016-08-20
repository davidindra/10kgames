<?php
$jokes = array();

for($i = 0; $i < 10; $i++){
    $json = json_decode(file_get_contents('https://api.chucknorris.io/jokes/random'), true);
    $jokes[] = $json['value'];
}

require 'main.nojs.tpl.php';
