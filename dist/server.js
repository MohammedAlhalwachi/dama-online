"use strict";

var express = require('express');

var app = express();

var http = require('http').createServer(app);

var io = require('socket.io')(http);

var RoomsManager = require('./js/RoomsManager.js');

app.use(express["static"](__dirname + '/'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
var roomsManager = new RoomsManager(io);

function randomRoomId() {
  return Math.round(Math.random() * 10000000);
}

io.on('connection', function (socket) {
  // console.log('a user connected, id: ', socket.id);
  socket.on('join', function (roomId, onSuccess) {
    console.log('request to join room ID: ' + roomId);
    var room; //joining ...

    if (roomId === null) room = roomsManager.getAvailableRoom();else room = roomsManager.getOrCreateRoom(roomId);
    console.log('room trying to join: ' + room.id);
    var joined = room.addPlayer(socket, onSuccess);
    console.log('joined: ' + joined);
    if (joined === false) socket.disconnect();
    socket.on('disconnect', function () {
      roomsManager.closeRoom(room.id);
      console.log("disconnected, room (".concat(room.id, ") is closed"));
    });
  });
});
var port = process.env.PORT || 80;
console.log(port);
http.listen(port, function () {
  console.log('listening on *:' + port);
});
//# sourceMappingURL=server.js.map