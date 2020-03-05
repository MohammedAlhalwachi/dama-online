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

var Room = require('./Room.js');

module.exports = /*#__PURE__*/function () {
  function RoomsManager(io) {
    _classCallCheck(this, RoomsManager);

    this.rooms = [];
    this.io = io;
  }

  _createClass(RoomsManager, [{
    key: "createRoom",
    value: function createRoom(id) {
      var room = this.rooms.find(function (room) {
        return room.id === id;
      });
      if (room !== undefined) return room;
      room = new Room(this.io, id);
      this.rooms.push(room);
      return room;
    }
  }, {
    key: "getRoom",
    value: function getRoom(id) {
      return this.rooms.find(function (room) {
        return room.id === id;
      });
    }
  }, {
    key: "randomRoomId",
    value: function randomRoomId() {
      return Math.round(Math.random() * 10000000);
    }
  }, {
    key: "getAvailableRoom",
    value: function getAvailableRoom() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.rooms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var room = _step.value;
          var playersCount = room.playersCount;
          if (playersCount === 1) return room;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return this.createRoom(this.randomRoomId());
    }
  }, {
    key: "getOrCreateRoom",
    value: function getOrCreateRoom(id) {
      var room = this.getRoom(id);
      if (room === undefined) room = this.createRoom(id);
      return room;
    }
  }, {
    key: "closeRoom",
    value: function closeRoom(id) {
      var room = this.getRoom(id);
      if (room === undefined) return;
      var index = this.rooms.indexOf(room);
      this.rooms.splice(index, 1);
      room.close();
    }
  }]);

  return RoomsManager;
}();
//# sourceMappingURL=RoomsManager.js.map