"use strict";

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = /*#__PURE__*/function () {
  function Room(io, id) {
    _classCallCheck(this, Room);

    this.id = id;
    this.io = io;
    this.players = [];
    this.playersCount = 0;
  }

  _createClass(Room, [{
    key: "addPlayer",
    value: function addPlayer(socket, joined) {
      var _this = this;

      if (this.playersCount >= 2) {
        joined(false);
        return false;
      }

      socket.join(this.id);
      this.playersCount++;
      this.players.push(socket);
      if (this.playersCount === 1) joined(true, 'yellow');else joined(true, 'black');
      if (this.players.length === 2) this.ready();
      socket.on('command', function (commandObj) {
        _this.sendCommand(socket, commandObj);
      });
      return true;
    }
  }, {
    key: "emitEvent",
    value: function emitEvent(event, message) {
      this.io.to(this.id).emit(event, message);
    }
  }, {
    key: "sendCommand",
    value: function sendCommand(sender, commandObj) {
      sender.broadcast.to(this.id).emit('command', commandObj);
    }
  }, {
    key: "ready",
    value: function ready() {
      this.emitEvent('ready');
    }
  }, {
    key: "close",
    value: function close() {
      this.emitEvent('close');
    }
  }]);

  return Room;
}();
//# sourceMappingURL=Room.js.map