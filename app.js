var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log('server started');

class Ball {
  constructor() {
    this.x = 512;
    this.y = 300;
    this.radius = 10;
    this.color = "#2FBF86";
    this.velocityX = 0;
    this.velocityY = 0;
    this.maxSpeed = 100;
    this.friction = .99;
  }
  reset() {
    this.x = 512;
    this.y = 300;
    this.velocityX = 0;
    this.velocityY = 0;
  }
  update() {
    this.updatePosition();
    this.checkGoal();
  }
  updatePosition(){
    for (var i in playerList){
      if (playerList[i].x < this.x + 5 && playerList[i].x + 16 > this.x &&
          playerList[i].y < this.y + 5 && playerList[i].y + 16 > this.y) {
        if (playerList[i].velocityX == 0 && playerList[i].velocityY == 0) {
          this.velocityX = -this.velocityX;
          this.velocityY = -this.velocityY;
        }
        else {
          this.velocityX = playerList[i].velocityX*2;
          this.velocityY = playerList[i].velocityY*2;
        }
      }
    }

    this.velocityY *= this.friction;
    this.y += this.velocityY;
    this.velocityX *= this.friction;
    this.x += this.velocityX;

    if (this.x + this.velocityX > 1014) {
      this.velocityX = -this.velocityX;
    } else if (this.x + this.velocityX < 5){
      this.velocityX = -this.velocityX;
    }
    if (this.y + this.velocityY >= 590) {
      this.velocityY = -this.velocityY;
    } else if (this.y + this.velocityY < 5) {
      this.velocityY = -this.velocityY;
    }

    if (this.x >= 1014) {
      this.x = 1014;
    } else if (this.x < 0){
      this.x = 0;
    }
    if (this.y >= 590) {
      this.y = 590;
    } else if (this.y < 0) {
      this.y = 0;
    }
  }

  checkGoal() {
    if (this.x >= 1008) {
      console.log("yup");
      if (this.y >= 256 && this.y <= 320) {
        // goal. reset position
        this.reset();
        score['b'] += 1;
        console.log("goal");
      }
    }
    if (this.x <= 8) {
      console.log("no.");
      if (this.y >= 256 && this.y <= 320) {
        // goal. reset position
        this.reset();
        this.velocityX =
        score['r'] += 1;
        console.log("goal");
      }
    }
  }
}

class Player {
  constructor(id, team) {
    this.team = team;
    if (this.team == "blue"){
      this.x = 312;
      this.y = 300;
      this.color = "#4858FE";
    }
    else {
      this.x = 712;
      this.y = 300;
      this.color = "#f44256";
    }
    this.id = id;
    this.size = 16;
    this.number = '' + Math.floor(Math.random() * 10);
    this.leftPressed = false;
    this.rightPressed = false;
    this.upPressed = false;
    this.downPressed = false;
    this.velocityX = 0;
    this.velocityY = 0;
    this.maxSpeed = 3;
    this.friction = .85;
  }

  updatePosition(){
    if (this.leftPressed) {
      if (this.velocityX > -this.maxSpeed) {
        this.velocityX--;
      }
    }
    if (this.rightPressed) {
      if (this.velocityX < this.maxSpeed) {
        this.velocityX++;
      }
    }
    if (this.upPressed) {
      if (this.velocityY > -this.maxSpeed) {
        this.velocityY--;
      }
    }
    if (this.downPressed) {
      if (this.velocityY < this.maxSpeed) {
        this.velocityY++;
      }
    }
    this.velocityY *= this.friction;
    this.y += this.velocityY;
    this.velocityX *= this.friction;
    this.x += this.velocityX;

    if (this.x + this.velocityX > 1008) {
      this.velocityX = -this.velocityX;
    } else if (this.x + this.velocityX < 0){
      this.velocityX = -this.velocityX;
    }
    if (this.y + this.velocityY >= 584) {
      this.velocityY = -this.velocityY;
    } else if (this.y + this.velocityY < 0) {
      this.velocityY = -this.velocityY;
    }

    if (this.x >= 1008) {
      this.x = 1008;
    } else if (this.x < 0){
      this.x = 0;
    }
    if (this.y >= 584) {
      this.y = 584;
    } else if (this.y < 0) {
      this.y = 0;
    }
  }
};

var socketList = {}
var playerList = {}
var ball = new Ball();
var score = {
  'b': 0,
  'r': 0
};

goalPositions = []
count = 0;
var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket) {
  socket.id = count;
  socketList[count] = socket;
  count++;
  if (count % 2 == 0){
    team = "blue"
  }
  else {
    team = "red"
  }
  var player = new Player(socket.id, team);
  playerList[socket.id] = player;

  socket.on('disconnect', function() {
    delete socketList[socket.id];
    delete playerList[socket.id];
  });

  socket.on('keyPress', function(data) {
    if (data.inputId === 'left') {
      player.leftPressed = data.state;
    } else if (data.inputId === 'right') {
      player.rightPressed = data.state;
    } else if (data.inputId === 'up') {
      player.upPressed = data.state;
    } else if (data.inputId === 'down') {
      player.downPressed = data.state;
    }
  });
});

setInterval(function() {
  var pack = [];
  ball.update();
  for(var i in playerList) {
    var player = playerList[i];
    player.updatePosition();
    pack.push({
      x: player.x,
      y: player.y,
      color: player.color,
      size: player.size,
      ballX: ball.x,
      ballY: ball.y,
      ballRadius: ball.radius,
      score: score,
    });
  }
  for(var i in socketList) {
    var socket = socketList[i];
    socket.emit('newPositions', pack);
  }
}, 1000/60);
