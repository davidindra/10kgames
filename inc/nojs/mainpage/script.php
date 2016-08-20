<?php
$jokes = array();

for($i = 0; $i < 3; $i++){
    $json = json_decode(file_get_contents('https://api.chucknorris.io/jokes/random'), true);
    $jokes[] = $json['value'];
}

require 'template.php';
