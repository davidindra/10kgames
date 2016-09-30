/**
 * Connect to WebSocket server
 */
var websocket = new WebSocket("ws://"+window.location.hostname+":9000");



/**
 * WebSocket message received
 * @param evt: object; Object of WebSockets' data
 */
websocket.onmessage = evt => {
    var data = JSON.parse(evt.data);

    if (data.state == "connected")
        id("nickname").value = data.username; // fill input field with generated nickname
    else if (data.state == "ok") {
        var e = data.event;
        switch (e) {
            case "changename": id("login").hide(); id("gameChoose").show(); // user changed his name
                    break;

            case "queue": id("loading").show(); id("gameChoose").hide(); id("queue").innerHTML = data.nth; // user is queued
                    break;

            case "gameready": startGame(data); // user is matched
                    break;

            case "game": (data.opponentdata) ? window[data.gamename].gameEvent(data.opponentdata) : false; // some game event
                    break;
        }
    } else if (data.state == "error") // error on server
        alert("Server error: "+data.error)
    else if (data.state != "disconnected") // uknown state
        alert("Unknown server error.");
};

/*
websocket.onclose = function() {
  alert("Connection closed!");
};
*/

websocket.onerror = () => {
  alert("Connection error!");
};



/**
 * Page is closing - disconnect user from server.
 */
window.onbeforeunload = e => {
    websocket.send(JSON.stringify({'event':'disconnect'}));
};
