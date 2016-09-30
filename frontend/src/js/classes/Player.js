class Player extends Component {
    constructor(width, height, color, x, y, score, name) {
        super(width, height, color, x, y);

        // Insert score element
        this.scoreEl = document.createElement("div");
        if ((color == "gray" && blocks.mySide == "left") || (color == "white" && blocks.mySide == "right"))
            this.scoreEl.className = color+" rightScore scoreDiv";
        else
            this.scoreEl.className = color+" leftScore scoreDiv";
        id("game").insertBefore(this.scoreEl, id("game").firstChild);

        // Insert name element
        var div = document.createElement("div");
        if ((color == "gray" && blocks.mySide == "left") || (color == "white" && blocks.mySide == "right"))
            div.className = color+" rightName nameDiv";
        else
            div.className = color+" leftName nameDiv";
        div.innerHTML = "<b>"+name+"</b>";
        id("game").insertBefore(div, id("game").firstChild);

        this.score = score;
    }



    /**
     * Check pressed keys and if arrays are pressed, move player
     * If MP, send direction chagne event to Opponent
     */
    directionChange() {
        if (blocks.keys[37]) // left arrow
            players["me"].speedX = -blocks.speed;
        else if (blocks.keys[39]) // right arrow
            players["me"].speedX =blocks.speed;
        else
            players["me"].speedX = 0;

        if (blocks.keys[38]) // up arrow
            players["me"].speedY = -blocks.speed;
        else if (blocks.keys[40]) // down arrow
            players["me"].speedY =blocks.speed;
        else
            players["me"].speedY = 0;

        if (!blocks.sp) {
            var me = players["me"];
            websocket.send(JSON.stringify({
                event: "game",
                data: {
                    type: "directionChange",
                    speedX: me.speedX,
                    speedY: me.speedY,
                    x: me.x,
                    y: me.y
                }
            }));
        }
    }



    /**
     * Multiplayer only - move player automatically towards the fruit
     */
    autoMove() {
        if (fruit.x - blocks.speed > this.x)
            this.speedX = blocks.speed-1;
        else if (fruit.x + blocks.speed < this.x)
            this.speedX = -blocks.speed-1;
        else
            this.speedX = 0;

        if (fruit.y - blocks.speed > this.y)
            this.speedY = blocks.speed-1;
        else if (fruit.y + blocks.speed < this.y)
            this.speedY = -blocks.speed-1;
        else
            this.speedY = 0;
    }



    /**
     * Check if player has cathced the fruit
     * @param player: boolean; This is current player (default: false)
     * @return boolean
     */
    checkFruit(player=false) {
        if (!this.crashWith(fruit)) // didn't catch fruit
            return false;

        // Catched the fruit!
        this.score++;
        while (players["me"].crashWith(fruit) || players["you"].crashWith(fruit))
            fruit.newPos(true); // generate new position of fruit

        if (!blocks.sp && players) // send message about me catching the fruit to the opponent
            websocket.send(JSON.stringify({
                event:"game",
                data: {
                    type: "scored",
                    score: this.score,
                    fruitX: fruit.x,
                    fruitY: fruit.y
                }
            }));

        if (this.score < blocks.maxScore) // game not over yet
            return true;

        // Game over!
        blocks.gameOver(player);
        if (!blocks.sp) // send info about game over to opponent
            websocket.send(JSON.stringify({event: "game", data: {type: "gameOver", score: this.score}}));
    }
}
