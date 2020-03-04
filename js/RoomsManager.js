let Room = require('./Room.js');

module.exports = class RoomsManager {
    constructor(io){
        this.rooms = [];
        this.io = io;
    }
    
    createRoom(id){
        let room = this.rooms.find(room => room.id === id);
        
        if(room !== undefined)
            return room;
        
        room = new Room(this.io, id);
        this.rooms.push(room);
        
        return room;
    }
    
    getRoom(id){
        return this.rooms.find(room => room.id === id);
    }

    randomRoomId(){
        return Math.round(Math.random() * 10000000);
    }
    getAvailableRoom(){
        for(let room of this.rooms){
            let playersCount = room.playersCount;
            
            if(playersCount === 1)
                return room;
        }
        
        
        return this.createRoom(this.randomRoomId());
    }
    
    getOrCreateRoom(id){
        let room = this.getRoom(id);

        if(room === undefined)
            room = this.createRoom(id);
        
        return room;
    }

    closeRoom(id){
        let room = this.getRoom(id);
        if(room === undefined)
            return;
        
        let index = this.rooms.indexOf(room);
        this.rooms.splice(index, 1);
        
        room.close();
    }
};