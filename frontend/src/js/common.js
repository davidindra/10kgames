document.addEventListener("DOMContentLoaded", () => { // $(document).ready() => show login
    id("login").show();
});

let css = `background-color: #ffe6e6;
            color: #ff4500;
            font-size: 1.2em;`;
console.info("%c We would be very grateful if you don't cheat ;)", css);


/**
 * Validate name.
 * If valid, change user's nickname.
 * @return string/object
 */
var nickname;
function submitName() {
    var name = id("nickname").value.trim();
    if (name == "")
        return id("nickname").value = "Nickname";
    nickname = name;
    return websocket.send(JSON.stringify({
        "event": "changename",
        "newname": name
    }));
}



/**
 * User is matched - begin the game!
 * @param data: object; Opponent data
 * @param sp: boolean; Single player or not
 * @return boolean; Game has been started or not
 */
function startGame(data, sp=false) {
    id("game").show();
    id("loading").hide();
    if (data.gamename == "blocks") {
        drawBlocks(nickname, data.opponent.username, data.side, sp);
        blocks.start();
        return true;
    }
    return false;
}



/**
 * Queue user to selected game.
 * @param gamename: string; Name of selected game
 * @return object; Websockets' object
 */
function load(gamename) {
    return websocket.send(JSON.stringify({
        "event": "queue",
        "gamename": gamename
    }));
}
