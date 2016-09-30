"use strict";function _possibleConstructorReturn(a,b){if(!a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!b||"object"!=typeof b&&"function"!=typeof b?a:b}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function, not "+typeof b);a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function blocksSinglePlayer(){websocket.send(JSON.stringify({event:"queueleave"})),startGame({gamename:"blocks",side:"left",opponent:{username:"GameBot"}},!0)}function drawBlocks(a,b,c){var d=arguments.length>3&&void 0!==arguments[3]&&arguments[3];blocks.mySide=c,blocks.sp=d,blocks.draw(),"left"==c?(players.me=new Player(30,30,"white",50,185,0,a),players.you=new Player(30,30,"gray",720,185,0,b)):(players.me=new Player(30,30,"white",720,185,0,a),players.you=new Player(30,30,"gray",50,185,0,b)),fruit=new Component(10,10,"red",395,195),updateGameArea()}function timeOut(a,b){var c="left"==blocks.mySide?{left:"You",right:"Opponent",leftX:50,rightX:685}:{left:"Opponent",right:"You",leftX:35,rightX:715};updateGameArea(),blocks.context.font="150px Courier New",blocks.context.fillStyle="white",blocks.context.fillText(a,350,125),blocks.context.font="18px Courier New",blocks.context.fillStyle="white",blocks.context.fillText(c.left,c.leftX,170),blocks.context.fillText(c.right,c.rightX,170),blocks.context.fillText("Catch this",345,180),setTimeout(b,1e3)}function updateGameArea(){blocks.clear(),blocks.sp&&"undefined"!=typeof blocks.interval&&players.you.autoMove(),players.you.newPos(),players.you.update(),players.me.newPos(),players.me.update(),blocks.sp&&players.you.checkFruit(!1),players.me.checkFruit(!0),fruit.update()}function submitName(){var a=id("nickname").value.trim();return""==a?id("nickname").value="Nickname":(nickname=a,websocket.send(JSON.stringify({event:"changename",newname:a})))}function startGame(a){var b=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return id("game").show(),id("loading").hide(),"blocks"==a.gamename&&(drawBlocks(nickname,a.opponent.username,a.side,b),blocks.start(),!0)}function load(a){return websocket.send(JSON.stringify({event:"queue",gamename:a}))}function id(a){return document.getElementById(a)}var _createClass=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),players=[],fruit,blocks={canvas:document.createElement("canvas"),keys:{37:!1,38:!1,39:!1,40:!1},speed:4,mySide:null,sp:!1,maxScore:25,draw:function(){this.canvas.width=800,this.canvas.height=400,this.context=this.canvas.getContext("2d"),id("game").innerHTML="<h1>Blocks</h1>",id("game").insertBefore(this.canvas,id("game").firstChild)},start:function(){var a=this;timeOut("3",function(){timeOut("2",function(){timeOut("1",a.begin)})})},begin:function(){updateGameArea(),blocks.interval=setInterval(updateGameArea,15),window.addEventListener("keydown",blocks._handleKeyDown),window.addEventListener("keyup",blocks._handleKeyUp)},_handleKeyDown:function(a){a.keyCode in blocks.keys&&blocks.keys[a.keyCode]!==!0&&(blocks.keys[a.keyCode]=!0,players.me.directionChange())},_handleKeyUp:function(a){a.keyCode in blocks.keys&&(blocks.keys[a.keyCode]=!1,players.me.directionChange())},clear:function(){this.context.clearRect(0,0,this.canvas.width,this.canvas.height)},gameEvent:function(a){"scored"==a.type?(players.you.score++,fruit.setPos(a.fruitX,a.fruitY)):"directionChange"==a.type?(players.you.x=a.x,players.you.y=a.y,players.you.speedX=a.speedX,players.you.speedY=a.speedY):"gameOver"==a.type&&blocks.gameOver(!1)},gameOver:function(){var a=arguments.length>0&&void 0!==arguments[0]&&arguments[0],b=a?"You won! :)":"You lost :(";clearInterval(this.interval),updateGameArea(),this.context.font="70px Courier New",this.context.fillStyle="white",this.context.fillText("Game over",210,150),this.context.font="35px Courier New",this.context.fillText(b,300,200),this.context.font="25px Courier New",this.context.fillText("Click here to play again!",225,270),this.canvas.addEventListener("click",this.leaveGame),window.removeEventListener("keydown",blocks._handleKeyDown),window.removeEventListener("keyup",blocks._handleKeyUp),this.mySide=null,this.interval=void 0},leaveGame:function(){blocks.canvas.removeEventListener("click",blocks.leaveGame),id("game").hide(),id("gameChoose").show()}},Component=function(){function a(b,c,d,e,f){_classCallCheck(this,a),this.color=d,this.width=b,this.height=c,this.speedX=0,this.speedY=0,this.x=e,this.y=f}return _createClass(a,[{key:"update",value:function(){var a=blocks.context;a.fillStyle=this.color,a.fillRect(this.x,this.y,this.width,this.height),isNaN(parseInt(this.score))||(this.scoreEl.innerText=this.score)}},{key:"newPos",value:function(){var a=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return a?this.setPos(Math.floor(Math.random()*(blocks.canvas.width-this.width)),Math.floor(Math.random()*(blocks.canvas.height-this.height))):(this.x<0-this.width?this.x=blocks.canvas.width:this.x>blocks.canvas.width?this.x=0-this.width:this.x+=this.speedX,void(this.y<0-this.height?this.y=blocks.canvas.height:this.y>blocks.canvas.height?this.y=0-this.height:this.y+=this.speedY))}},{key:"crashWith",value:function(a){var b=this.x,c=this.x+this.width,d=this.y,e=this.y+this.height,f=a.x,g=a.x+a.width,h=a.y,i=a.y+a.height,j=!0;return(e<h||d>i||c<f||b>g)&&(j=!1),j}},{key:"setPos",value:function(a,b){this.x=a,this.y=b}}]),a}(),Player=function(a){function b(a,c,d,e,f,g,h){_classCallCheck(this,b);var i=_possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).call(this,a,c,d,e,f));i.scoreEl=document.createElement("div"),"gray"==d&&"left"==blocks.mySide||"white"==d&&"right"==blocks.mySide?i.scoreEl.className=d+" rightScore scoreDiv":i.scoreEl.className=d+" leftScore scoreDiv",id("game").insertBefore(i.scoreEl,id("game").firstChild);var j=document.createElement("div");return"gray"==d&&"left"==blocks.mySide||"white"==d&&"right"==blocks.mySide?j.className=d+" rightName nameDiv":j.className=d+" leftName nameDiv",j.innerHTML="<b>"+h+"</b>",id("game").insertBefore(j,id("game").firstChild),i.score=g,i}return _inherits(b,a),_createClass(b,[{key:"directionChange",value:function(){if(blocks.keys[37]?players.me.speedX=-blocks.speed:blocks.keys[39]?players.me.speedX=blocks.speed:players.me.speedX=0,blocks.keys[38]?players.me.speedY=-blocks.speed:blocks.keys[40]?players.me.speedY=blocks.speed:players.me.speedY=0,!blocks.sp){var a=players.me;websocket.send(JSON.stringify({event:"game",data:{type:"directionChange",speedX:a.speedX,speedY:a.speedY,x:a.x,y:a.y}}))}}},{key:"autoMove",value:function(){fruit.x-blocks.speed>this.x?this.speedX=blocks.speed-1:fruit.x+blocks.speed<this.x?this.speedX=-blocks.speed-1:this.speedX=0,fruit.y-blocks.speed>this.y?this.speedY=blocks.speed-1:fruit.y+blocks.speed<this.y?this.speedY=-blocks.speed-1:this.speedY=0}},{key:"checkFruit",value:function(){var a=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(!this.crashWith(fruit))return!1;for(this.score++;players.me.crashWith(fruit)||players.you.crashWith(fruit);)fruit.newPos(!0);return!blocks.sp&&players&&websocket.send(JSON.stringify({event:"game",data:{type:"scored",fruitX:fruit.x,fruitY:fruit.y}})),this.score<blocks.maxScore||(blocks.gameOver(a),void(blocks.sp||websocket.send(JSON.stringify({event:"game",data:{type:"gameOver"}}))))}}]),b}(Component);document.addEventListener("DOMContentLoaded",function(){id("login").show()});var css="background-color: #ffe6e6;\n            color: #ff4500;\n            font-size: 1.2em;";console.info("%c We would be very grateful if you don't cheat ;)",css);var nickname;Element.prototype.show=function(){var a=this.getAttribute("data-display")||"initial";this.style.display=a},Element.prototype.hide=function(){this.style.display="none"};var dotNum=0,maxDots=5;setInterval(function(){var a=dotNum,b=maxDots-1,c=(a%(2*b)>b-1?b-1-a%b:a%b+1)+1;id("loading-header").innerHTML="Waiting for opponent<br>"+".".repeat(c),dotNum++},300);var websocket=new WebSocket("ws://"+window.location.hostname+":9000");websocket.onmessage=function(a){var b=JSON.parse(a.data);if("connected"==b.state)id("nickname").value=b.username;else if("ok"==b.state){var c=b.event;switch(c){case"changename":id("login").hide(),id("gameChoose").show();break;case"queue":id("loading").show(),id("gameChoose").hide(),id("queue").innerHTML=b.nth;break;case"gameready":startGame(b);break;case"game":!!b.opponentdata&&window[b.gamename].gameEvent(b.opponentdata)}}else"error"==b.state?alert("Server error: "+b.error):"disconnected"!=b.state&&alert("Unknown server error.")},websocket.onerror=function(){alert("Connection error!")},window.onbeforeunload=function(a){websocket.send(JSON.stringify({event:"disconnect"}))};