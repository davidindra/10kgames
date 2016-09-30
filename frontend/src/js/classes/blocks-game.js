var players = [], fruit;



/**
 * Remove user from Q and start single player
 */
function blocksSinglePlayer() {
    websocket.send(JSON.stringify({'event':'queueleave'})); // leave the Q
    startGame({gamename: 'blocks', side: 'left', opponent: {username: 'GameBot'}}, true);
}


/**
 * Players are matched, start the game.
 * @param myName: string; Name of this player
 * @param opName: string; Name of Opponent
 * @param mySide: string (left|right); Side of this player
 * @param sp: boolean; Singleplayer or not (defaulf false)
 */
function drawBlocks(myName, opName, mySide, sp=false) {
    blocks.mySide = mySide;
    blocks.sp = sp;
    blocks.draw(); // draw canvas
    // Initialize players
    if (mySide == "left") {
        players["me"] = new Player(30, 30, "white", 50, 185, 0, myName);
        players["you"] = new Player(30, 30, "gray", 720, 185, 0, opName);
    } else {
        players["me"] = new Player(30, 30, "white", 720, 185, 0, myName);
        players["you"] = new Player(30, 30, "gray", 50, 185, 0, opName);
    }
    fruit = new Component(10, 10, "red", 395, 195); // Initialize fruit
    updateGameArea(); // start the game
}



/**
 * Countdown before game starts.
 * @param text: string; Text to be shown (3, 2, 1)
 * @param after: function; Function to run after 1s
 */
function timeOut(text, after) {
    let texts = (blocks.mySide == "left") ? {left: "You", right: "Opponent", leftX: 50, rightX: 685} :
                {left: "Opponent", right: "You", leftX: 35, rightX: 715};
    updateGameArea();
    blocks.context.font="150px Courier New";
    blocks.context.fillStyle = "white";
    blocks.context.fillText(text, 350, 125); // countdown number

    // Player's names
    blocks.context.font="18px Courier New";
    blocks.context.fillStyle = "white";
    blocks.context.fillText(texts.left, texts.leftX, 170); // left player's name
    blocks.context.fillText(texts.right, texts.rightX, 170); // right player's name
    blocks.context.fillText("Catch this", 345, 180); // text over fruit

    setTimeout(after, 1000);
}



/**
 * Re-render game area
 */
function updateGameArea() {
    blocks.clear(); // empty canvas
    if (blocks.sp && typeof blocks.interval !== "undefined") // game has began and it is single player -> move opponent
        players["you"].autoMove();

    // Move this player
    players["you"].newPos();
    players["you"].update();

    // Move opponent
    players["me"].newPos();
    players["me"].update();

    if (blocks.sp) // check if bot has catched the fruit
        players["you"].checkFruit(false);

    players["me"].checkFruit(true); // check if I have catched the fruit

    fruit.update(); // update fruit's position
}
