<?php
$json = json_decode(file_get_contents('https://api.chucknorris.io/jokes/random'), true);
$joke = $json['value'];

require 'template.php';
