<html>
<head>
    <meta charset="utf-8">
    <title>10kGames</title>

    <style><?php require 'template.css'; ?></style>
    <script><?php require 'template.js'; ?></script>
</head>
<body onload="startGame()">
<noscript>
    <section id="nojs">
        <h1>10kGames</h1>
        <h4>online multiplayer gaming portal</h4>
        <span>Welcome on 10kGames! 10kGames is a new gaming portal created for 10kApart contest, where everybody can play a few minigames with others. Erm, <i>everybody</i>... with a JavaScript. We are so sorry, but if you do not have JS, it's really hard to make you able to play games in browser :( If you feel too much disappointed by this information, we can try to make you laugh with some dumb Chuck Norris joke:</span><br>
        <h4><?= $joke ?></h4>
        <span>Feel better now? :) (If not, you can of course <a href="/">reload</a> for new joke.) We hope so. We can also offer you some best user statistics, if you want to know:</span><br><br>
        <center>
        <table>
            <thead>
            <tr>
                <th colspan="3">Gamename</th>
            </tr>
            <tr>
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
            </tbody>
        </table>
        </center>
    </section>
</noscript>
</body>
</html>
