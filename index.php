<?php
session_start();

if(isset($_GET['env'])){ // second hit
    if($_GET['env'] == 'js'){
        $_SESSION['env'] = 'js';
    }elseif($_GET['env'] == 'reset'){
        unset($_SESSION['env']);
    }else{
        $_SESSION['env'] = 'nojs';
    }
    header('Location: /');
}elseif(isset($_SESSION['env'])){ // nth hit
    if($_SESSION['env'] == 'js'){
        require './inc/main.js.php';
    }else{
        require './inc/main.nojs.php';
    }
}else{ // first hit
    require './inc/loading.html';
}

die();
