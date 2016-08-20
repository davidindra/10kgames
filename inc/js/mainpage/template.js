var pls = [],
    fruit;

function startGame() {
    canvas.start();
    pls["me"] = new Component(30, 30, "white", 10, 120, 0);
    pls["you"] = new Component(30, 30, "gray", 10, 120, 0);
    fruit = new Component(10, 10, "red", 100, 200, false);
}

var canvas = {
    canvas: document.createElement("canvas"),
    keys: [],
    speed: 5,
    start: function() {
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 25);
        window.addEventListener('keydown', function (e) {
            canvas.keys = (canvas.keys || []);
            canvas.keys[e.keyCode] = (e.type == "keydown");
        });
        window.addEventListener('keyup', function (e) {
            canvas.keys[e.keyCode] = (e.type == "keydown");
        });
    },
    clear: function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

function Component(width, height, color, x, y, score) {
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
            ctx.fillText("Score: "+this.score, this.x, 20);
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
    }
};

function updateGameArea() {
    canvas.clear();
    pls["me"].speedX = 0;
    pls["me"].speedY = 0;
    if (canvas.keys[37]) {pls["me"].speedX = -canvas.speed; }
    if (canvas.keys[39]) {pls["me"].speedX = canvas.speed; }
    if (canvas.keys[38]) {pls["me"].speedY = -canvas.speed; }
    if (canvas.keys[40]) {pls["me"].speedY = canvas.speed; }

    /*
    pls["you"].setPos(x, y); <-- set from AJAX request
    pls["you"].newPos();
    pls["you"].update();
    */
    pls["you"].speedY = canvas.speed;
    pls["you"].speedX = canvas.speed;
    pls["you"].newPos();
    pls["you"].update();

    pls["me"].newPos();
    pls["me"].update();

    if (pls["me"].crashWith(fruit))
        pls["me"].score++;

    if (pls["you"].crashWith(fruit))
        pls["you"].score++;

    while (pls["me"].crashWith(fruit) || pls["you"].crashWith(fruit))
        fruit.newPos(true);
    fruit.update();
}