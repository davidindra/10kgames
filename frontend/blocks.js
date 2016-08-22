var players = [],
    fruit;

function drawBlocks(myName, opName, mySide, sp) {
    blocks.mySide = mySide;
    blocks.sp = sp;
    blocks.draw();
    if (mySide == "left") {
        players["me"] = new Component(30, 30, "white", 50, 185, 0, myName);
        players["you"] = new Component(30, 30, "gray", 720, 185, 0, opName);
    } else {
        players["me"] = new Component(30, 30, "white", 720, 185, 0, myName);
        players["you"] = new Component(30, 30, "gray", 50, 185, 0, opName);
    }
    fruit = new Component(10, 10, "red", 395, 195, false);
    updateGameArea();
}

function timeOut(text, after) {
    var texts = {left: "Opponent", right: "You", leftX: 35, rightX: 715};;
    updateGameArea();
    blocks.context.font="150px Courier New";
    blocks.context.fillStyle = "white";
    blocks.context.fillText(text, 350, 125);

    blocks.context.font="18px Courier New";
    blocks.context.fillStyle = "white";
    if (blocks.mySide == "left")
        texts = {left: "You", right: "Opponent", leftX: 50, rightX: 685};
    blocks.context.fillText(texts.left, texts.leftX, 170);
    blocks.context.fillText(texts.right, texts.rightX, 170);
    blocks.context.fillText("Catch this", 345, 180);

    setTimeout(after, 1000);
}

var blocks = {
    canvas: document.createElement("canvas"),
    keys: {
        37: false,
        38: false,
        39: false,
        40: false
    },
    speed: 4,
    mySide: null,
    sp: false,
    draw: function() {
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        id("game").innerHTML = "<h1>Blocks</h1>";
        id("game").insertBefore(this.canvas, id("game").firstChild);
    },
    start: function() {
        timeOut("3", function() {
            timeOut("2", function() {
                timeOut("1",blocks.begin)
            });
        });
    },
    begin: function() {
        updateGameArea();
        this.interval = setInterval(updateGameArea, 15);
        window.addEventListener('keydown', function (e) {
            if (e.keyCode in blocks.keys && blocks.keys[e.keyCode] !== true) {
                blocks.keys[e.keyCode] = true;
                players["me"].directionChange();
            }
        });
        window.addEventListener('keyup', function (e) {
            if (e.keyCode in blocks.keys) {
                blocks.keys[e.keyCode] = false;
                players["me"].directionChange();
            }
        });

    },
    clear: function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    gameEvent: function(data) {
        console.log(data);
        if (data.type == "scored") {
            players["you"].score++;
            fruit.setPos(data.fruitX, data.fruitY);
        }
        else if (data.type == "directionChange") {
            players["you"].x = data.x;
            players["you"].y = data.y;
            players["you"].speedX = data.speedX;
            players["you"].speedY = data.speedY;
        }
    }
};

function Component(width, height, color, x, y, score, name) {
    if (score !== false) {
        this.scoreEl = document.createElement("div");
        if ((color == "gray" && blocks.mySide == "left") || (color == "white" && blocks.mySide == "right"))
            this.scoreEl.className = color+" rightScore scoreDiv";
        else
            this.scoreEl.className = color+" leftScore scoreDiv";
        id("game").insertBefore(this.scoreEl, id("game").firstChild);
    }

    if (name) {
        var div = document.createElement("div");
        if ((color == "gray" && blocks.mySide == "left") || (color == "white" && blocks.mySide == "right"))
            div.className = color+" rightName nameDiv";
        else
            div.className = color+" leftName nameDiv";
        div.innerHTML = "<b>"+name+"</b>";
        id("game").insertBefore(div, id("game").firstChild);
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
        var ctx =blocks.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.score !== false)
            this.scoreEl.innerText = this.score;
    },

    newPos: function(rand) {
        if (rand)
            return this.setPos(Math.floor(Math.random() * (blocks.canvas.width - this.width)), Math.floor(Math.random() * (blocks.canvas.height - this.height)));

    	if (this.x < 0-this.width)
        	this.x =blocks.canvas.width;
        else if (this.x >blocks.canvas.width)
        	this.x = 0-this.width;
        else
        	this.x += this.speedX;

    	if (this.y < 0-this.height)
        	this.y =blocks.canvas.height;
        else if (this.y >blocks.canvas.height)
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
        if (blocks.keys[37])
            players["me"].speedX = -blocks.speed;
        else if (blocks.keys[39])
            players["me"].speedX =blocks.speed;
        else
           players["me"].speedX = 0;

        if (blocks.keys[38])
            players["me"].speedY = -blocks.speed;
        else if (blocks.keys[40])
            players["me"].speedY =blocks.speed;
        else
            players["me"].speedY = 0;

        var me = players["me"];
        websocket.send(JSON.stringify({
            event:"game",
            data: {
                type: "directionChange",
                speedX: me.speedX,
                speedY: me.speedY,
                x: me.x,
                y: me.y
            }}));
    }
};

function updateGameArea() {
   blocks.clear();

    /*
    players["you"].setPos(x, y); <-- set from WebSockets request
    players["you"].speedX = 0; <-- set from WebSockets request
    players["you"].speedY = 0; <-- set from WebSockets request
    */

    if (blocks.sp) {
        if (fruit.x - blocks.speed > players["you"].x)
            players["you"].speedX = blocks.speed;
        else if (fruit.x + blocks.speed < players["you"].x)
            players["you"].speedX = -blocks.speed;
        else
            players["you"].speedX = 0;

        if (fruit.y - blocks.speed > players["you"].y)
            players["you"].speedY = blocks.speed;
        else if (fruit.y + blocks.speed < players["you"].y)
            players["you"].speedY = -blocks.speed;
        else
            players["you"].speedY = 0;
    }

    players["you"].newPos();
    players["you"].update();

    players["me"].newPos();
    players["me"].update();

    if (players["me"].crashWith(fruit)) {
        while (players["me"].crashWith(fruit) || players["you"].crashWith(fruit))
            fruit.newPos(true);

        players["me"].score++;
        websocket.send(JSON.stringify({
            event:"game",
            data: {
                type: "scored",
                fruitX: fruit.x,
                fruitY: fruit.y
            }}));
    }

    if (blocks.sp && players["you"].crashWith(fruit))
        players["you"].score++;

    fruit.update();
}