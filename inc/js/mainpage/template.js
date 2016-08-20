var players = [];
var fruit;

function startGame() {
    myGameArea.start();
    players["me"] = new component(30, 30, "white", 10, 120, 0);
    fruit = new component(10, 10, "red", 100, 200, false);
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, score) {
    this.gamearea = myGameArea;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.score = score;
    this.update = function() {
        var ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.score !== false)
            ctx.fillText("Score: "+this.score, 20, 20);
    }
    this.newPos = function() {
    	if (this.x < 0-this.width)
        	this.x = myGameArea.canvas.width;
        else if (this.x > myGameArea.canvas.width)
        	this.x = 0-this.width;
        else
        	this.x += this.speedX;

    	if (this.y < 0-this.height)
        	this.y = myGameArea.canvas.height;
        else if (this.y > myGameArea.canvas.height)
        	this.y = 0-this.height;
        else
        	this.y += this.speedY;
    }

    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
               (mytop > otherbottom) ||
               (myright < otherleft) ||
               (myleft > otherright)) {
           crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    myGameArea.clear();
    players["me"].speedX = 0;
    players["me"].speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37]) {players["me"].speedX = -2; }
    if (myGameArea.keys && myGameArea.keys[39]) {players["me"].speedX = 2; }
    if (myGameArea.keys && myGameArea.keys[38]) {players["me"].speedY = -2; }
    if (myGameArea.keys && myGameArea.keys[40]) {players["me"].speedY = 2; }
    players["me"].newPos();
    players["me"].update();
    if (players["me"].crashWith(fruit)) {
        players["me"].score++;
        fruit.x = Math.floor(Math.random() * (myGameArea.canvas.width - 20));
        fruit.y = Math.floor(Math.random() * (myGameArea.canvas.height - 20));
    }
    fruit.update();
}