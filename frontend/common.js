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

var x = 0;
setInterval(function() {
    id("loading-header").innerHTML += ".";
    x++;
    if (x == 3) {
        var substr = id("loading-header").innerHTML.trim().slice(0, -3);
        id("loading-header").innerHTML = substr;
        x = 0;
    }
}, 500);

function load(gametype) {
    websocket.send(JSON.stringify({
        "event": "queue",
        "gametype": gametype
    }));
}

function submitName() {
    var name = id("nickname").value.trim();
    if (name == "")
        return id("nickname").value = "Nickname";
    websocket.send(JSON.stringify({
        "event": "changename",
        "newName": name
    }));
}

function startGame(data) {
    id ("game").show();
    if (data.gamename == "blocks") {
        id("loading").hide();
        drawGame();
        blocks.start();
    }
}

window.onbeforeunload = function() {
    websocket.send(JSON.stringify({'event':'disconnect'}));
};

var websocket = new WebSocket("ws://localhost:9000");
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
        }
    } else if (data.state == "error") {
        alert("Server error: "+data.error)
    } else if (data.state != "disconnected") {
        alert("Unknown server error.");
    }
};

websocket.onclose = function() {
  alert("Connection closed!");
};

websocket.onerror = function() {
  alert("Connection error!");
};