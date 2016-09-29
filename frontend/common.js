function id(id) {
    return document.getElementById(id);
}

Element.prototype.show = function() {
    this.style.display = "initial";
};
Element.prototype.hide = function() {
    this.style.display = "none";
};

document.addEventListener("DOMContentLoaded", function() {
    id("login").show();
});

var x = 0,
    maxdots = 5,
    dot = ".",
    nickname;
setInterval(function() {
    var dotnum = (x % (maxdots*2) > (maxdots - 1) ? (maxdots - 1) - x % maxdots : x % maxdots + 1) + 1;
    id("loading-header").innerHTML = "Waiting for opponent<br>" + dot.repeat(dotnum);
    x++;
}, 300);

function load(gamename) {
    websocket.send(JSON.stringify({
        "event": "queue",
        "gamename": gamename
    }));
}

function submitName() {
    var name = id("nickname").value.trim();
    if (name == "")
        return id("nickname").value = "Nickname";
    nickname = name;
    websocket.send(JSON.stringify({
        "event": "changename",
        "newname": name
    }));
}

function startGame(data, sp) {
    id("game").show();
    if (data.gamename == "blocks") {
        id("loading").hide();
        sp = (sp) ? true : false;
        drawBlocks(nickname, data.opponent.username, data.side, sp);
        blocks.start();
    }
}

window.onbeforeunload = function() {
    websocket.send(JSON.stringify({'event':'disconnect'}));
};

var websocket = new WebSocket("ws://"+window.location.hostname+":9000");
websocket.onmessage = function(evt) {
    var data = JSON.parse(evt.data);
    console.log(data);
    if (data.state == "connected") {
        id("nickname").value = data.username;
    } else if (data.state == "ok") {
        var e = data.event;
        switch (e) {
            case "changename": id("login").hide(); id("gameChoose").show(); break;
            case "queue": id("loading").show(); id("gameChoose").hide(); id("queue").innerHTML = data.nth; break;
            case "gameready": startGame(data); break;
            case "newFruit": console.log("Generate new fruit, regenerate score"); break;
            case "directionChange": console.log("Change opponent's position and speed"); break;
            case "game": (data.opponentdata) ? window[data.gamename].gameEvent(data.opponentdata) : false; break;
        }
    } else if (data.state == "error") {
        alert("Server error: "+data.error)
    } else if (data.state != "disconnected") {
        alert("Unknown server error.");
    }
};
/*
websocket.onclose = function() {
  alert("Connection closed!");
};
*/
websocket.onerror = function() {
  alert("Connection error!");
};