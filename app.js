var mongojs = require('mongojs');
var db = mongojs('localhost:27017/myDB', ['account', 'playerStats']);

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
    this.radius = 5;
    this.color = "#2FBF86";
    this.velocityX = 0;
    this.velocityY = 0;
    this.maxSpeed = 50;
    this.friction = 1;
  }
  restart() {
    this.x = 512;
    this.y = 300;
    this.velocityX = 0;
    this.velocityY = 0;
  }
  reset() {
    this.x = Math.floor(Math.random() * 1016);
    this.y = Math.floor(Math.random() * 595);
    this.velocityX = Math.floor(Math.random() * 5);
    this.velocityY = Math.floor(Math.random() * 5);
  }
  update() {
    this.updatePosition();
  }
  updatePosition(){
    for (var i in Player.list){
      if (Player.list[i].x < this.x + 5 && Player.list[i].x + 16 > this.x &&
          Player.list[i].y < this.y + 5 && Player.list[i].y + 16 > this.y) {
            this.reset();
            Player.list[i].captures++;
      }
    }

    this.velocityY *= this.friction;
    this.y += this.velocityY;
    this.velocityX *= this.friction;
    this.x += this.velocityX;

    if (this.x + this.velocityX > 1019) {
      this.velocityX = -this.velocityX;
    } else if (this.x + this.velocityX < 5){
      this.velocityX = -this.velocityX;
    }
    if (this.y + this.velocityY >= 595) {
      this.velocityY = -this.velocityY;
    } else if (this.y + this.velocityY < 5) {
      this.velocityY = -this.velocityY;
    }

    if (this.x >= 1019) {
      this.x = 1019;
    } else if (this.x < 0){
      this.x = 0;
    }
    if (this.y >= 595) {
      this.y = 595;
    } else if (this.y < 0) {
      this.y = 0;
    }
  }
};

class Debris {
  constructor() {
    this.x = Math.floor(Math.random() * 1008);
    this.y = 8;
    this.velocityX = 0//Math.floor(Math.random() * 4) + 2;
    this.velocityY = Math.floor(Math.random() * 4) + 2;
  }
  reset() {
    this.x = Math.floor(Math.random() * 1016);
    this.y = 8
    this.velocityX = 0
    this.velocityY = Math.floor(Math.random() * 5);
  }
  update() {
    this.updatePosition();
  }
  updatePosition() {
    for(var i in Player.list) {
      if (Player.list[i].x < this.x + 16 && Player.list[i].x + 16 > this.x &&
          Player.list[i].y < this.y + 16 && Player.list[i].y + 16 > this.y) {
            this.reset();
            Player.list[i].captures--;
            Player.list[i].reset();
      }
    }
    this.y += this.velocityY;
    this.x += this.velocityX;

    if (this.x + this.velocityX > 1008) {
      this.velocityX = -this.velocityX;
    } else if (this.x + this.velocityX < 5){
      this.velocityX = -this.velocityX;
    }
    if (this.y + this.velocityY >= 584) {
      this.velocityY = -this.velocityY;
    } else if (this.y + this.velocityY < 5) {
      this.velocityY = -this.velocityY;
    }

    if (this.x >= 1008) {
      this.x = 1008;
    } else if (this.x < 0){
      this.x = 0;
    }
    if (this.y >= 584) {
      this.y = 595;
    } else if (this.y < 0) {
      this.y = 0;
    }
  }
}

class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    if (playerCount == 1) {
      this.color = "blue";
      this.x = 250;
      this.y = 200;
    }
    if (playerCount == 2) {
      this.color = "red";
      this.x = 750;
      this.y = 200;
    }
    if (playerCount == 3) {
      this.color = "teal";
      this.x = 250;
      this.y = 400;
    }
    if (playerCount == 4){
      this.color = "purple";
      this.x = 750;
      this.y = 400;
    }

    this.startX = this.x;
    this.startY = this.y;
    this.size = 16;
    this.number = '' + Math.floor(Math.random() * 10);
    this.leftPressed = false;
    this.rightPressed = false;
    this.upPressed = false;
    this.downPressed = false;
    this.velocityX = 0;
    this.velocityY = 0;
    this.maxSpeed = 5;
    this.friction = .975;
    this.captures = 0;
    this.ready = false;
    Player.list[id] = this;
  }
  reset() {
    this.x = this.startX;
    this.y = this.startY;
    this.velocityX = 0;
    this.velocityY = 0;
  }
  update() {
    this.updatePosition();
  }
  updatePosition(){
    for(var i in Player.list) {
      if (this.id != Player.list[i].id) {
        if (Player.list[i].x < this.x + 16 && Player.list[i].x + 16 > this.x &&
            Player.list[i].y < this.y + 16 && Player.list[i].y + 16 > this.y) {
              this.velocityX = -this.velocityX;
              this.velocityY = -this.velocityY;
        }
      }
    }
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
Player.list = {}
Player.onConnect = function(socket, name){
  var player = new Player(socket.id, name);
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
}
Player.onDisconnect = function(socket) {
  /*
  var player = Player.list[socket.id];
  setPlayerInactive(player, function(){
    db.account.update({username: player.name}, {$set:{active: false}});
  });*/
  delete Player.list[socket.id]
  if (Object.keys(Player.list).length < 2) {
    gameover = true;
  }
}
Player.reset = function() {
  for(var i in Player.list) {
    Player.list[i].reset();
    Player.list[i].captures = 0;
  }
}
var users = {}
var inGame = false;
var socketList = {}
var playerCount = 0;
var ball = new Ball();
var debrisList = [];
var gameover = false;
var winner = "";
for(var i = 0; i < 10; i++) {
  debrisList.push(new Debris());
}

var playerLookup = function(p) {
  for (var i in Player.list) {
    if (p == Player.list[i].name){
      return Player.list[i];
    }
  }
  return false;
};

var checkGameStart = function() {
  var playersReady = 0;
  playing = [];
  for (var i in Player.list) {
    if (Player.list[i].ready) {
      playing.push(Player.list[i])
      playersReady++;
    }
  }
  if (playersReady >= 2) {
    for (var i in socketList) {
      var socket = socketList[i];
      socket.emit('startingGame');
    }
  }
};

var resetGame = function() {
  Player.reset();
  ball.restart();
  debrisList = [];
  gameover = false;
  winner = "";
  for(var i = 0; i < 10; i++) {
    debrisList.push(new Debris());
  }
  for (var i in socketList) {
    var socket = socketList[i];
    socket.emit('clearInfo');
  }
  startGame();
};

var sendPlayerList = function() {
  pack = [];
  for (var i in Player.list) {
    var player = Player.list[i];
    pack.push({
      name: player.name,
    })
  }
  for(var i in socketList) {
    var socket = socketList[i];
    socket.emit('activePlayers', pack);
  }
};

var setPlayerInactive = function(data, callback) {
  try {
    db.account.find({username: data.name}, function(err, res){
      if (res.length > 0) {
        callback();
      }
    });
  } catch(error) {
    console.log(error);
  }
}
var isValidPassword = function(data, callback) {
  db.account.find({username: data.username, password: data.password}, function(err, res){
    if (res.length > 0) {
      callback(true);
    } else {
      callback(false);
    }
  });
}
var isUsernameTaken = function(data, callback) {
  db.account.find({username: data.username}, function(err, res){
    if (res.length > 0) {
      callback(true);
    } else {
      callback(false);
    }
  });
}

var addUser = function(data, callback) {
  db.account.insert({username: data.username, password: data.password}, function(err){
    callback();
  });
}
var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket) {
  socket.id = Math.random();
  socketList[socket.id] = socket;
  socket.on('signIn', function(data) {
    if (playerCount < 4) {
      playerCount++;
      Player.onConnect(socket, data.username);
    }
    socket.emit('signInResponse', {success: true});
    //socket.emit('playerConnected', {name: data.username});
    /*
    isValidPassword(data, function(res) {
      if (res) {
        if (playerCount < 4) {
          playerCount++;
          Player.onConnect(socket, data.username);
        }
        db.account.update({username: data.username}, {$set:{active: true}});
        socket.emit('signInResponse', {success: true});
        socket.emit('playerConnected', {name: data.username});
        sendPlayerList();
      } else {
        socket.emit('signInResponse', {success: false});
      }
    });*/
  });

  /*
  socket.on('signUp', function(data) {
    isUsernameTaken(data, function(res) {
      if (res) {
        socket.emit('signUpResponse', {success: false});
      } else {
        addUser(data, function(){
          db.playerStats.insert({username: data.username, wins: 0, losses: 0});
          socket.emit('signUpResponse', {success: true});
        });
      }
    });
  });*/

  socket.on('activePlayerList', function() {
    sendPlayerList();
  });

  socket.on('startGame', function() {
    for(var i in socketList) {
      var socket = socketList[i];
      socket.emit('removeStartButton');
    }
    startGame();
  });

  socket.on('newGame', function() {
    resetGame();
  });

  socket.on('toLobby', function(data) {
    player = playerLookup(data.username);
    if (player) {
      player.ready = false;
      readyCount = 0;
      for (var i in Player.list) {
        if (Player.list[i].ready) {
          readyCount++;
        }
      }
      if (readyCount < 2) {
        inGame = false;
        for(var i in socketList) {
          var socket = socketList[i];
          socket.emit("endingGame");
        }
      }
    }
  });

  socket.on('playerReady', function(data) {
    player = playerLookup(data.username);
    if (player) {
      player.ready = true;
      checkGameStart();
    }
  });
  socket.on('disconnect', function() {
    playerCount--;
    delete socketList[socket.id];
    Player.onDisconnect(socket);
  });
});

var gameLoop = function() {
  var pack = [];
  var debrisPack = [];
  for (var i in debrisList) {
    var debris = debrisList[i];
    debris.update();
    debrisPack.push({
      x: debris.x,
      y: debris.y
    });
  }
  for(var i in Player.list) {
    var player = Player.list[i];
    if (player.captures >= 10) {
      winner = player.name;
      gameover = true;
    }
    ball.update();
    player.update();
    pack.push({
      x: player.x,
      y: player.y,
      color: player.color,
      size: player.size,
      captures: player.captures,
      ballX: ball.x,
      ballY: ball.y,
      ballRadius: ball.radius,
      debris: debrisPack,
    });
  }
  for(var i in socketList) {
    var socket = socketList[i];
    if (!gameover) {
      socket.emit('newPositions', pack);
    } else {
      socket.emit('gameover',{winner});
    }
  }
  if (gameover) {
    inGame = false;
    clearInterval(this);
  }
};


var startGame = function() {
  console.log("initializing game");
  inGame = true;
  setInterval(gameLoop, 1000/60);
}

var stopGame = function() {
  console.log("stopping game");
  inGame = false;
  clearInterval(gameLoop);
}
