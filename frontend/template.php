<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>10kGames</title>

    <?php if (isset($_GET['js'])) { ?>
        <script><?php require 'build.js'; ?></script>
        <style><?php require 'buildJS.css'; ?></style>
    <?php }else{ ?>
        <script>
            if (window.location.search.indexOf("?js") === -1) {
                window.location = "/?js"; // if user turn on JS at some time after first load
            }
        </script>
        <style><?php require 'buildNoJS.css'; ?></style>
    <?php } ?>
    <link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet">
</head>
<body>
<noscript>
  <div class="vcen">
    <div>
    <section id="nojs">
        <h1>10kGames</h1>
        <h4>online multiplayer gaming portal</h4>
        <span>Welcome on 10kGames! 10kGames is a new gaming portal created for 10kApart contest, where everybody can play a few minigames with others. Erm, <i>everybody</i>... with a JavaScript. We are so sorry, but if you do not have JS, it's really hard to make you able to play games in browser :( If you feel too much disappointed by this information, we can try to make you laugh with some dumb Chuck Norris joke:</span><br>
        <h4><?= $joke ?></h4>
        <span>Feel better now? :) (If not, you can of course <a href="/">reload</a> for new joke.) We hope so.</span>
        <!--
        <div id="score">
            <table>
                <thead>
                <tr class="gamename">
                    <th colspan="3">Snake</th>
                </tr>
                <tr class="labels">
                    <th>No.</th>
                    <th>Nickname</th>
                    <th>Points</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1.</td>
                    <td>Kuxa</td>
                    <td>5457</td>
                </tr>
                <tr>
                    <td>2.</td>
                    <td>matyaskova</td>
                    <td>3549</td>
                </tr>
                <tr>
                    <td>3.</td>
                    <td>david</td>
                    <td>2241</td>
                </tr>
                </tbody>
            </table>
            <table>
                <thead>
                <tr class="gamename">
                    <th colspan="3">Breakout</th>
                </tr>
                <tr class="labels">
                    <th>No.</th>
                    <th>Nickname</th>
                    <th>Points</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1.</td>
                    <td>Kuxa2</td>
                    <td>5457</td>
                </tr>
                </tbody>
            </table>
            <table>
                <thead>
                <tr class="gamename">
                    <th colspan="3">Pong</th>
                </tr>
                <tr class="labels">
                    <th>No.</th>
                    <th>Nickname</th>
                    <th>Points</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1.</td>
                    <td>Kuxa7</td>
                    <td>241</td>
                </tr>
                <tr>
                    <td>2.</td>
                    <td>adam</td>
                    <td>157</td>
                </tr>
                </tbody>
            </table>
        </div>-->
    </section>
  </div>
  </div>
</noscript>
<?php $ua = $_SERVER['HTTP_USER_AGENT']; if(strpos($ua, 'Lynx') === false && strpos($ua, 'Links') === false){ ?>
<div id="login" class="vcen" data-display="table">
  <div>
    <h1>10kGames</h1>
    <h4>online multiplayer gaming portal</h4>
    <span>Welcome on 10kGames! 10kGames is a new gaming portal created for 10kApart contest, where everybody can play a few minigames with others.</span>
    <h4>Choose your nickname in the field bellow</h4>
    <div style="text-align: center">
        <input type="text" id="nickname" value=""><br>
        <button id="letsPlay" onclick="submitName()">Let's play!</button>
    </div>
  </div>
</div>
<div id="gameChoose">
    <h1>Select game</h1>
    <table>
        <tr>
            <td onclick="load('blocks')">
                <h4>Blocks</h4>
            </td>
        </tr>
        <tr>
            <td class="soon">
                <h4>More games coming soon!</h4>
            </td>
        </tr>
    </table>
</div>
<div id="loading" class="vcen" data-display="table">
  <div>
    <h1 id="loading-header">Waiting for an opponent</h1>
    <h4>You're <span id="queue"></span> in the queue.</h4>
    <button onclick="blocksSinglePlayer()">Simulate 2<sup>nd</sup> player</button>
  </div>
</div>
<div id="game">
</div>
<?php } ?>
<div id="mobile-alert">
    <h1>Nah...</h1>
    <h2>...you say you're on the phone <i>right now</i>?</h2>
    We feel so bad about this, but... You cannot use this amazing gaming portal on the phone. Just imagine it - how would you control the movement of a brick on 2D game desk <b>by touches</b>? In a browser?<br><br>
    We don't say that this is impossible, but it's really not easy. But if you want to be able to play on the phone too, your
    <a href="https://github.com/davidindra/10kgames" target="_blank">pull request</a> is welcome! :)
</div>
</body>
</html>
