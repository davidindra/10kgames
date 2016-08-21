var players = [],
    fruit;

function drawGame() {
    canvas.draw();
    players["me"] = new Component(30, 30, "white", 50, 185, 0);
    players["you"] = new Component(30, 30, "gray", 720, 185, 0);
    fruit = new Component(10, 10, "red", 395, 195, false);
    updateGameArea();
    canvas.context.font="18px Courier New";
    canvas.context.fillStyle = "white";
    canvas.context.fillText("You", 50, 170);
    canvas.context.fillText("Opponent", 685, 170);
    canvas.context.fillText("Catch this", 345, 180);
}

function timeOut(text, after) {
    updateGameArea();
    canvas.context.font="150px Courier New";
    canvas.context.fillStyle = "white";
    canvas.context.fillText(text, 350, 250);
    setTimeout(after, 1000);
}

var canvas = {
    canvas: document.createElement("canvas"),
    keys: [],
    speed: 4,
    draw: function() {
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    },
    start: function() {
        document.getElementById("button").style.display = "none";
        timeOut("3", function() {
            timeOut("2", function() {
                timeOut("1", canvas.begin)
            });
        });
    },
    begin: function() {
        updateGameArea();
        this.interval = setInterval(updateGameArea, 15);
        window.addEventListener('keydown', function (e) {
            canvas.keys = (canvas.keys || []);
            canvas.keys[e.keyCode] = (e.type == "keydown");
            players["me"].directionChange();
        });
        window.addEventListener('keyup', function (e) {
            canvas.keys[e.keyCode] = (e.type == "keydown");
            players["me"].directionChange();
        });

    },
    clear: function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

function Component(width, height, color, x, y, score) {
    if (score !== false) {
        this.scoreEl = document.createElement("div");
        this.scoreEl.className = color+"Score scoreDiv";
        document.body.insertBefore(this.scoreEl, document.body.childNodes[0]);
    }
    this.color = color;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.score = score;
}

Component.prototype = {
    update: function() {
        var ctx = canvas.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.score !== false)
            this.scoreEl.innerText = this.score;
    },

    newPos: function(rand) {
        if (rand)
            return this.setPos(Math.floor(Math.random() * (canvas.canvas.width - this.width)), Math.floor(Math.random() * (canvas.canvas.height - this.height)));

    	if (this.x < 0-this.width)
        	this.x = canvas.canvas.width;
        else if (this.x > canvas.canvas.width)
        	this.x = 0-this.width;
        else
        	this.x += this.speedX;

    	if (this.y < 0-this.height)
        	this.y = canvas.canvas.height;
        else if (this.y > canvas.canvas.height)
        	this.y = 0-this.height;
        else
        	this.y += this.speedY;
    },

    crashWith: function(obj) {
        var myleft = this.x,
            myright = this.x + (this.width),
            mytop = this.y,
            mybottom = this.y + (this.height),
            otherleft = obj.x,
            otherright = obj.x + (obj.width),
            othertop = obj.y,
            otherbottom = obj.y + (obj.height),
            crash = true;
        if ((mybottom < othertop) ||
               (mytop > otherbottom) ||
               (myright < otherleft) ||
               (myleft > otherright)) {
           crash = false;
        }
        return crash;
    },

    setPos: function(x, y) {
        this.x = x;
        this.y = y;
    },

    directionChange: function() {
        if (canvas.keys[37])
            players["me"].speedX = -canvas.speed;
        else if (canvas.keys[39])
            players["me"].speedX = canvas.speed;
        else
           players["me"].speedX = 0;

        if (canvas.keys[38])
            players["me"].speedY = -canvas.speed;
        else if (canvas.keys[40])
            players["me"].speedY = canvas.speed;
        else
            players["me"].speedY = 0;
    }
};

function updateGameArea() {
    canvas.clear();

    /*
    players["you"].setPos(x, y); <-- set from WebSockets request
    players["you"].speedX = 0; <-- set from WebSockets request
    players["you"].speedY = 0; <-- set from WebSockets request
    */

    // ↓ bot
    if (fruit.x-canvas.speed > players["you"].x)
        players["you"].speedX = canvas.speed;
    else if (fruit.x+canvas.speed < players["you"].x)
        players["you"].speedX = -canvas.speed;
    else
        players["you"].speedX = 0;

    if (fruit.y-canvas.speed > players["you"].y)
        players["you"].speedY = canvas.speed;
    else if (fruit.y+canvas.speed < players["you"].y)
        players["you"].speedY = -canvas.speed;
    else
        players["you"].speedY = 0;
    // ↑ bot

    players["you"].newPos();
    players["you"].update();

    players["me"].newPos();
    players["me"].update();

    if (players["me"].crashWith(fruit))
        players["me"].score++; // <-- send WebSockets request

    // ↓ bot
    if (players["you"].crashWith(fruit))
        players["you"].score++;
    // ↑ bot

    while (players["me"].crashWith(fruit) || players["you"].crashWith(fruit))
        fruit.newPos(true);
    fruit.update();
}