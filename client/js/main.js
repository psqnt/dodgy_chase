var socket = io();

// Sign in Window
var signIn = document.getElementById("signIn");
var signInUsername = document.getElementById("signIn-username");
var signInPassword = document.getElementById("signIn-password");
var signInButton = document.getElementById("signIn-signIn");
var signUpButton = document.getElementById("signIn-signUp");
var username = signInUsername.value;
var gameDiv = document.getElementById('gameDiv');

signInButton.onclick = function() {
  socket.emit("signIn",{username:signInUsername.value});
};

/* Removed because this game doesnt need a database or login system right now
signInButton.onclick = function() {
  socket.emit("signIn",{username:signInUsername.value, password:signInPassword.value});
};

signUpButton.onclick = function() {
  socket.emit("signUp",{username:signInUsername.value, password:signInPassword.value});
};*/

socket.on("signInResponse", function(data) {
  if (data.success) {
    signIn.style.display = "none";
    lobbyDiv.style.display = "inline-block";
    username = signInUsername.value;
    displayPlayer();
    socket.emit('activePlayerList');
  } else {
    alert("Sign In Unsuccessful");
  }
});

/*
socket.on("signUpResponse", function(data) {
  if (data.success) {
    alert("Sign Up Successful");
  } else {
    alert("Sign Up Unsuccessful");
  }
});
*/

// lobby
lobbyDiv = document.getElementById("lobbyDiv");
lobby = document.getElementById('lobby');
findGameButton = document.getElementById('findGame');

findGameButton.onclick = function() {
  var div = document.createElement("div");
  div.innerHTML += "Waiting for 1 more player to search for game.";
  lobbyDiv.appendChild(div);
  socket.emit('playerReady', {username});
}

var displayPlayer = function() {
  var div = document.createElement('div');
  div.innerHTML += "Logged in as <strong>" + username +"</strong><br>";
  div.innerHTML += "<hr><br>Players in lobby <br><hr>";
  lobby.appendChild(div);
};

playerDiv = document.getElementById('players');
socket.on('activePlayers', function(data) {
  playerDiv.innerHTML = "";
  for (var i = 0; i < data.length; i++) {
    var div = document.createElement('div');
    div.innerHTML += "<strong>"+data[i].name+"</strong>";
    playerDiv.appendChild(div);
  }
});


socket.on('startingGame', function(){
  lobbyDiv.style.display = "none";
  gameDiv.style.display = "inline-block";
  startButton.style.display= "inline-block";
});

// Game
var startButton = document.getElementById("startGame");
var newButton = document.getElementById("newGame");
//var lobbyButton = document.getElementById("toLobby");
var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
var gameStarted = false;

startButton.onclick = function() {
  socket.emit('startGame');
};

socket.on('removeStartButton', function(){
  startButton.style.display = "none";
});

newButton.onclick = function() {
  socket.emit('newGame');
};

socket.on('newGameBegin', function() {
  newButton.style.display = "none";
})

/*
lobbyButton.onclick = function() {
  gameDiv.style.display = "none";
  lobbyDiv.style.display = "inline-block";
  socket.emit("toLobby", {username: username});
  socket.emit('activePlayerList');
};

socket.on('endingGame', function() {
  gameDiv.style.display = "none";
  lobbyDiv.style.display = "inline-block";
  socket.emit('activePlayerList');
});
*/

socket.on('newPositions', function(data) {
  try {
    context.clearRect(0, 0, canvas.width, canvas.height);
    // write score on screen
    context.fillStyle = "black";
    context.font = "14px Arial";
    context.textAlign = "center";
    context.textBaseline = "top";

    // draw ball
    context.beginPath();
    context.arc(data[0].ballX, data[0].ballY, data[0].ballRadius, 0, Math.PI*2);
    context.fillStyle = "black";
    context.fill();
    context.closePath();

    captures = "";
    for(var i = 0; i < data.length; i++) {
      context.fillStyle = data[i].color;
      context.fillRect(data[i].x, data[i].y, data[i].size, data[i].size);
      captures += data[i].color + ": " + data[i].captures + " ";

      for(var j = 0; j < data[i].debris.length; j++) {
        context.fillStyle = "brown";
        context.fillRect(data[i].debris[j].x, data[i].debris[j].y, 16, 16);
      }
    }
    context.fillStyle = "black";
    context.fillText(captures, canvas.width / 2, 10);
  } catch (error) {
      signIn.style.display = "none";
      lobbyDiv.style.display = "inline-block";
      username = signInUsername.value;
      displayPlayer();
      socket.emit('activePlayerList');
      console.log(error);
    }
});

socket.on('clearInfo', function() {
  document.getElementById('info').innerHTML = "";
});

socket.on('gameover', function(data) {
  startButton.style.display = "none";
  newButton.style.display = "inline-block";
  var info = document.getElementById('info');
  info.innerHTML += data.winner + " won the game!";
});

document.onkeydown = function(event) {
  if (event.keyCode === 37) {
    socket.emit('keyPress', {inputId: 'left', state: true});
  }
  if (event.keyCode === 38) {
    socket.emit('keyPress', {inputId: 'up', state: true});
  }
  if (event.keyCode === 39) {
    socket.emit('keyPress', {inputId: 'right', state: true});
  }
  if (event.keyCode === 40) {
    socket.emit('keyPress', {inputId: 'down', state: true});
  }
}

document.onkeyup = function(event) {
  if (event.keyCode === 37) {
    socket.emit('keyPress', {inputId: 'left', state: false});
  }
  if (event.keyCode === 38) {
    socket.emit('keyPress', {inputId: 'up', state: false});
  }
  if (event.keyCode === 39) {
    socket.emit('keyPress', {inputId: 'right', state: false});
  }
  if (event.keyCode === 40) {
    socket.emit('keyPress', {inputId: 'down', state: false});
  }
}
