<?php
session_start();

if(isset($_GET['env'])){ // we know which version we want - second hit
    if($_GET['env'] == 'js'){
        $_SESSION['env'] = 'js';
        require './inc/js.inc.php';
    }else{
        $_SESSION['env'] = 'nojs';
        require './inc/nojs.inc.php';
    }
}elseif(isset($_SESSION['env'])){ // we already know which version we want - nth hit
    if($_SESSION['env'] == 'js'){
        require './inc/js.inc.php';
    }else{
        require './inc/nojs.inc.php';
    }
}else{ // we are on mainpage, first hit
    require './inc/welcome.inc.php';
}

die();