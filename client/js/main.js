var socket = io();

var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

socket.on('newPositions', function(data) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  // write score on screen
  context.fillStyle = "black";
  context.font = "14px Arial";
  context.textAlign = "center";
  context.textBaseline = "top";
  context.fillText("Blue: " + data[0].score['b'] + " Red: " + data[0].score['r'], 50, 10);

  // draw ball
  context.beginPath();
  context.arc(data[0].ballX, data[0].ballY, data[0].ballRadius, 0, Math.PI*2);
  context.fillStyle = "#2FBF86";
  context.fill();
  context.closePath();

  context.fillStyle = "#333";
  context.fillRect(0, 256, 8, 64);
  context.fillRect(1016, 256, 8, 64);
  for(var i = 0; i < data.length; i++) {
    context.fillStyle = data[i].color;
    context.fillRect(data[i].x, data[i].y, data[i].size, data[i].size);
  }
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
