var blocks = {
    canvas: document.createElement("canvas"),
    keys: { // pressed keys
        37: false,
        38: false,
        39: false,
        40: false
    },
    speed: 4, // moving speed over canvas
    mySide: null, // left or right
    sp: false, // single player
    maxScore: 25,

    /**
     * Initialize canvas
     */
    draw: function() {
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        id("game").innerHTML = "<h1>Blocks</h1>";
        id("game").insertBefore(this.canvas, id("game").firstChild);
    },



    /**
     * Countdown and start the game
     */
    start: function() {
        timeOut("3", () => {
            timeOut("2", () => {
                timeOut("1", this.begin)
            });
        });
    },



    /**
     * Countdown is over, start the game
     */
    begin: () => {
        updateGameArea();
        blocks.interval = setInterval(updateGameArea, 15); // periodically update canvas

        // add listeners for arrows
        window.addEventListener('keydown', blocks._handleKeyDown);
        window.addEventListener('keyup', blocks._handleKeyUp);
    },



    /**
     * Handle key down
     */
    _handleKeyDown: e => {
        if (e.keyCode in blocks.keys && blocks.keys[e.keyCode] !== true) { // arrow key has been pressed
            blocks.keys[e.keyCode] = true;
            players["me"].directionChange();
        }
    },



    /**
     * Handle key up
     */
    _handleKeyUp: e => {
        if (e.keyCode in blocks.keys) { // arrow key has been unpressed
            blocks.keys[e.keyCode] = false;
            players["me"].directionChange();
        }
    },



    /**
     * Empty canvas
     */
    clear: function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },



    /**
     * Game event has arrived
     * @param data: object; Object of event date
     */
    gameEvent: data => {
        if (data.type == "scored") { // player has scored
            players["you"].score = data.score;
            fruit.setPos(data.fruitX, data.fruitY);
            if (data.score >= blocks.maxScore) // game over
                blocks.gameOver(false);
        } else if (data.type == "directionChange") { // player has changed direction
            players["you"].x = data.x;
            players["you"].y = data.y;
            players["you"].speedX = data.speedX;
            players["you"].speedY = data.speedY;
        } else if (data.type == "gameOver") { // player has won
            players["you"].score = data.score;
            blocks.gameOver(false);
        }
    },



    /**
     * Game has ended
     * @param won: boolean; If player has won (default: false)
     */
    gameOver: function(won=false)  {
        let text = (won) ? "You won! :)" : "You lost :(";
        clearInterval(this.interval); // don't update canvas anymore
        updateGameArea();

        this.context.font="70px Courier New";
        this.context.fillStyle = "white";

        this.context.fillText("Game over", 210, 150); // write Game over
        this.context.font="35px Courier New";
        this.context.fillText(text, 300, 200); // write won/lost

        this.context.font="25px Courier New";
        this.context.fillText("Click here to play again!", 225, 270); // write click here...

        this.canvas.addEventListener("click", this.leaveGame); // on canvas click

        // remove listeners for arrows
        window.removeEventListener('keydown', blocks._handleKeyDown);
        window.removeEventListener('keyup', blocks._handleKeyUp);

        // reset properties of canvas
        this.mySide = null;
        this.interval = undefined;
    },



    /**
     * Leave the game
     */
    leaveGame: function() {
        blocks.canvas.removeEventListener("click", blocks.leaveGame); // remove click listener

        id("game").hide();
        id("gameChoose").show();
    }
};
