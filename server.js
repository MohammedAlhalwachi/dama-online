let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

let RoomsManager = require('./js/RoomsManager.js');
 
app.use(express.static(__dirname + '/'));
// app.use(express.static(__dirname + '/css'));
// app.use(express.static(__dirname + '/js'));
// app.use(express.static(__dirname + '/css'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

let roomsManager = new RoomsManager(io);

function randomRoomId(){
    return Math.round(Math.random() * 10000000);
}


io.on('connection', function(socket){
    // console.log('a user connected, id: ', socket.id);
    
    socket.on('join', function (roomId, onSuccess) {
        console.log('request to join room ID: ' + roomId);

        let room;
        //joining ...
        if(roomId === null)
            room = roomsManager.getAvailableRoom();
        else
            room = roomsManager.getOrCreateRoom(roomId);
        console.log('room trying to join: ' + room.id);
        
        let joined = room.addPlayer(socket, onSuccess);
        
        console.log('joined: ' + joined);
        
        if(joined === false)
            socket.disconnect();

        socket.on('disconnect', function(){
            roomsManager.closeRoom(room.id);
            console.log(`disconnected, room (${room.id}) is closed`);
        });
    });
    
    
    // let requestedRoomId = socket.handshake.query.requestedRoomId;
    // let roomId; //room-123
    //
    // if(requestedRoomId !== undefined){
    //     roomId = requestedRoomId;
    // }else{
    //     roomId = randomRoomId();
    // }
    //
    // let room = roomsManager.createRoom(roomId);
    // let full = !room.addPlayer(socket);
    //
    // if(full){
    //     io.to(socket).emit('full', function () {
    //         socket.disconnect();
    //     });
    //     // room = roomsManager.createRoom(randomRoomId());
    //     // room.addPlayer(socket);
    // }
    //
    // room.ready();
    //
    //
    // socket.on('command', function (commandObj) {
    //     let command = commandObj.command;
    //     let payload = commandObj.payload;
    //
    //     console.log(commandObj);
    //     socket.broadcast.to(room.id).emit('command', commandObj);
    // });
    //
    // socket.on('disconnect', function(){
    //     roomsManager.closeRoom(room.id);
    // });
});



http.listen(80, function(){
    console.log('listening on *:80');
});