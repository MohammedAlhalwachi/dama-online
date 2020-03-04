module.exports = class Room {
    constructor(io, id){
        this.id = id;
        this.io = io;
        
        this.players = [];
        this.playersCount = 0;
    }
    
    addPlayer(socket, joined){
        if(this.playersCount >= 2) {
            joined(false);
            return false;
        }
            
        socket.join(this.id);
        
        this.playersCount++;
        this.players.push(socket);
        
        if(this.playersCount === 1)
            joined(true, 'yellow');
        else
            joined(true, 'black');
        
        if(this.players.length === 2)
            this.ready();

        socket.on('command', commandObj => {
            this.sendCommand(socket, commandObj);
        });
        
        return true;
    }
    
    emitEvent(event, message){
        this.io.to(this.id).emit(event, message);
    }
    sendCommand(sender, commandObj){
        sender.broadcast.to(this.id).emit('command', commandObj);
    }

    ready(){
        this.emitEvent('ready');
    }
    close(){
        this.emitEvent('close');
    }
};