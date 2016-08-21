<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>10kGames</title>

    <?php if (isset($_GET['js'])) { ?>
        <script>
            <?php require 'template.js'; ?>
        </script>
    <?php }else{ ?>
        <script>
            if (window.location.search.indexOf("?js") === -1) {
                window.location = "/?js"; // if user turn on JS at some time after first load
            }
        </script>
    <?php } ?>
    <link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet">
    <style><?php require 'template.css'; ?></style>
</head>
<body onload="drawGame()">
<noscript>
    <section id="nojs">
        <h1>10kGames</h1>
        <h4>online multiplayer gaming portal</h4>
        <span>Welcome on 10kGames! 10kGames is a new gaming portal created for 10kApart contest, where everybody can play a few minigames with others. Erm, <i>everybody</i>... with a JavaScript. We are so sorry, but if you do not have JS, it's really hard to make you able to play games in browser :( If you feel too much disappointed by this information, we can try to make you laugh with some dumb Chuck Norris joke:</span><br>
        <h4><?= $joke ?></h4>
        <span>Feel better now? :) (If not, you can of course <a href="/">reload</a> for new joke.) We hope so. We can also offer you some best user statistics, if you want to know:</span><br><br>
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
        </div>
    </section>
</noscript>
<button onclick="canvas.start()" id="button">Start Game</button>
</body>
</html>
