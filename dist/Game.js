"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var loader = PIXI.Loader.shared,
    Sprite = PIXI.Sprite,
    TextureCache = PIXI.utils.TextureCache,
    app = new PIXI.Application({
  width: board.clientWidth,
  // default: 800
  height: board.clientHeight,
  // default: 600
  antialias: true,
  // default: false
  transparent: true,
  // default: false
  resolution: window.devicePixelRatio || 1,
  // default: 1
  autoResize: true // default: false

}),
    cellSize = document.getElementsByClassName('cell')[0].getBoundingClientRect().width,
    cellPadding = cellSize * 0.15,
    damaSize = cellSize - cellPadding;

function removeUndefined(arr) {
  return arr.filter(function (cell) {
    return cell !== undefined;
  });
}

function getArrayDepth(value) {
  return Array.isArray(value) ? 1 + Math.max.apply(Math, _toConsumableArray(value.map(getArrayDepth))) : 0;
}

var Dama = /*#__PURE__*/function (_Sprite) {
  _inherits(Dama, _Sprite);

  function Dama(type, row, column) {
    var _this;

    var king = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    _classCallCheck(this, Dama);

    var texture = null;
    var black = type === 'black';
    var yellow = type === 'yellow';
    if (black && !king) texture = TextureCache['BlackDama.v1.png'];else if (black && king) texture = TextureCache['BlackDamaKing.v1.png'];else if (yellow && !king) texture = TextureCache['YellowDama.v1.png'];else if (yellow && king) texture = TextureCache['YellowDamaKing.v1.png'];
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Dama).call(this, texture));

    _this.anchor.set(0.5);

    _this.type = type;
    _this.row = row;
    _this.column = column;
    king ? _this.makeKing() : _this.removeKing();
    _this.width = damaSize;
    _this.height = damaSize;
    _this.vx = 0;
    _this.vy = 0;
    app.stage.addChild(_assertThisInitialized(_this));
    app.ticker.add(function (delta) {
      _this.moveAnimate(delta);
    });
    return _this;
  }

  _createClass(Dama, [{
    key: "getTexture",
    value: function getTexture() {
      var black = this.type === 'black';
      var yellow = this.type === 'yellow';
      var king = this.king;
      if (black && !king) return TextureCache['BlackDama.v1.png'];else if (black && king) return TextureCache['BlackDamaKing.v1.png'];else if (yellow && !king) return TextureCache['YellowDama.v1.png'];else if (yellow && king) return TextureCache['YellowDamaKing.v1.png'];
    }
  }, {
    key: "makeKing",
    value: function makeKing() {
      this.king = true;
      this.texture = this.getTexture();
    }
  }, {
    key: "removeKing",
    value: function removeKing() {
      this.king = false;
      this.texture = this.getTexture();
    }
  }, {
    key: "rowY",
    value: function rowY(row) {
      return cellSize * row + cellSize / 2;
    }
  }, {
    key: "columnX",
    value: function columnX(column) {
      return cellSize * column + cellSize / 2;
    }
  }, {
    key: "moveAnimate",
    value: function moveAnimate() {
      var xTo = this.columnX(this.column);
      var yTo = this.rowY(this.row);
      var speed = 10;
      var stepX = speed;
      var stepY = speed;
      var xDiff = Math.abs(xTo - this.x);
      if (xDiff < speed) stepX = xDiff;
      var yDiff = Math.abs(yTo - this.y);
      if (yDiff < speed) stepY = yDiff;
      if (this.x < xTo) this.vx = stepX;else if (this.x > xTo) this.vx = stepX * -1;else this.vx = 0;
      if (this.y < yTo) this.vy = stepY;else if (this.y > yTo) this.vy = stepY * -1;else this.vy = 0;
      this.x += this.vx;
      this.y += this.vy;
    }
  }, {
    key: "moveTo",
    value: function moveTo(row, column) {
      this.row = row;
      this.column = column;
    }
  }]);

  return Dama;
}(Sprite);

var Cell = /*#__PURE__*/function () {
  function Cell(dama, row, column, onClick, board) {
    _classCallCheck(this, Cell);

    this.row = row;
    this.column = column;
    this.dama = dama;
    this.playable = false;
    this.playableFor = null;
    this.toEat = null; //the cell to eat

    this.canEat = false;
    this.cellElem = document.querySelector(".row:nth-child( ".concat(this.row + 1, " ) .cell:nth-child( ").concat(this.column + 1, " )"));
    this.cellElem.onclick = onClick.bind(board, this);
  }

  _createClass(Cell, [{
    key: "makePlayable",
    value: function makePlayable(playableFor) {
      this.playable = true;
      this.playableFor = playableFor;
      this.cellElem.classList.add("playable");
    }
  }, {
    key: "removePlayable",
    value: function removePlayable() {
      if (this.playable === true) {
        //to optimize (adding and removing class, on removeAvailableMoves())
        this.playable = false;
        this.playableFor = null;
        this.toEat = null; //important

        this.cellElem.classList.remove("playable");
      }
    }
  }, {
    key: "makePlayableToEat",
    value: function makePlayableToEat(toEat) {
      this.toEat = toEat;
    }
  }, {
    key: "removePlayableToEat",
    value: function removePlayableToEat(toEat) {
      this.toEat = null;
    }
  }, {
    key: "removeDama",
    value: function removeDama() {
      app.stage.removeChild(this.dama);
      this.dama = null;
    }
  }, {
    key: "removeDamaWithoutAnimation",
    value: function removeDamaWithoutAnimation() {
      this.dama = null;
    }
  }, {
    key: "makeCanEat",
    value: function makeCanEat() {
      this.canEat = true;
      this.cellElem.classList.add("can-eat");
    }
  }, {
    key: "removeCanEat",
    value: function removeCanEat() {
      if (this.canEat === true) {
        //to optimize (adding and removing class, on removeAvailableMoves())
        this.canEat = false;
        this.cellElem.classList.remove("can-eat");
      }
    }
  }, {
    key: "oppositeOf",
    value: function oppositeOf(cell) {
      return !(this.dama.type === cell.dama.type);
    }
  }]);

  return Cell;
}();

var Board = /*#__PURE__*/function () {
  function Board(online, userType, onWin, game) {
    var _this2 = this;

    _classCallCheck(this, Board);

    this.online = online;
    this.userType = userType;
    this.onWin = onWin.bind(game); // const piecesTypes = [
    //     [null, null, null, null, null, null, null, null],
    //     ['black', 'black', 'black', null, 'black', 'yellow', 'black', null],
    //     ['black', 'black', 'black', null, null, null, 'black', null],
    //     [null, null, null, null, null, null, null, null],
    //     [null, null, 'yellow', 'black', null, null, null, null],
    //     ['yellow', 'yellow', null, 'yellow', 'yellow', null, null, 'yellow'],
    //     ['yellow', null, 'yellow', null, 'yellow', null, null, 'yellow'],
    //     // ['yellow', null, null, null, 'yellow', null, null, 'yellow'],
    //     [null, null, null, null, 'yellow', null, 'yellow', null],
    // ];

    socket.on('command', this.executeCommand.bind(this)); // const piecesTypes = [
    //     [null, null, null, null, null, null, null, null],
    //     [null, null, null, null, null, null, null, null],
    //     [null, null, null, null, 'black', null, null, null],
    //     [null, null, null, null, null, null, null, null],
    //     [null, null, null, null, 'yellow', null, null, null],
    //     [null, null, null, null, null, null, null, null],
    //     [null, null, null, null, null, null, null, null],
    //     [null, null, null, null, null, null, null, null],
    // ];

    var piecesTypes = [[null, null, null, null, null, null, null, null], ['black', 'black', 'black', 'black', 'black', 'black', 'black', 'black'], ['black', 'black', 'black', 'black', 'black', 'black', 'black', 'black'], [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null], ['yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow'], ['yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow'], [null, null, null, null, null, null, null, null]];
    this.turnType = 'yellow';
    this.lastEatDirection = null; //above, right, left, below

    this.forcePlayCell = null;
    this.cellsCanEat = [];
    var self = this;
    this.boardCells = piecesTypes.map(function (rowArray, row) {
      return rowArray.map(function (damaType, column) {
        var dama = null;
        if (damaType === null) dama = null;else if (damaType === 'black') dama = new Dama('black', row, column, false);else if (damaType === 'yellow') dama = new Dama('yellow', row, column, false);
        return new Cell(dama, row, column, _this2.cellOnClick, self);
      });
    });
  }

  _createClass(Board, [{
    key: "flipBoardCells",
    value: function flipBoardCells() {
      // console.log('flip');
      // abc;
      for (var row = 0; row < 4; row++) {
        for (var column = 0; column < 8; column++) {
          var cell = this.boardCells[row][column];
          var flippedRow = 7 - cell.row;
          var flippedColumn = 7 - cell.column;
          var originalCell = this.boardCells[cell.row][cell.column];
          var flippedCell = this.boardCells[flippedRow][flippedColumn];
          this.boardCells[cell.row][cell.column] = flippedCell;
          this.boardCells[flippedRow][flippedColumn] = originalCell;
        }
      }
    }
  }, {
    key: "flipTurn",
    value: function flipTurn() {
      var win = this.checkWin();

      if (win) {
        this.onWin();
        return;
      } // console.log('your turn');


      this.turnType === 'yellow' ? this.turnType = 'black' : this.turnType = 'yellow';
      this.lastEatDirection = null;
      this.updateCellsCanEat(); //on each turn do something
    }
  }, {
    key: "checkWin",
    value: function checkWin() {
      var countYellow = 0;
      var countYellowMan = 0;
      var countYellowKing = 0;
      var countBlack = 0;
      var countBlackMan = 0;
      var countBlackKing = 0;
      this.forAllCells(function (cell) {
        var dama = cell.dama;

        if (dama !== null) {
          if (dama.type === 'yellow') {
            countYellow += 1;
            if (!dama.king) countYellowMan += 1;else countYellowKing += 1;
          } else {
            countBlack += 1;
            if (!dama.king) countBlackMan += 1;else countBlackKing += 1;
          }
        }
      });
      if (countYellow === 0 || countBlack === 0) return true;
      if (countYellow === 1 && countYellowMan === 1 && countBlack === 1 && countBlackKing === 1) return true;
      if (countBlack === 1 && countBlackMan === 1 && countYellow === 1 && countYellowKing === 1) return true;
      return false;
    }
  }, {
    key: "updateCellsCanEat",
    value: function updateCellsCanEat() {
      var _this3 = this;

      // console.log(this.lastEatDirection);
      var cellsCanEat = [];
      this.cellsCanEat = [];
      this.forAllCells(function (cell) {
        cell.removeCanEat();
      });
      this.forAllCells(function (cell) {
        if (cell.dama !== null && cell.dama.type === _this3.turnType) {
          var canEat = _this3.cellsToEatObj(cell).length > 0;

          if (canEat) {
            cellsCanEat.push(cell); // console.log();
          }
        }
      });
      var maxDepth = -1;

      for (var _i = 0, _cellsCanEat = cellsCanEat; _i < _cellsCanEat.length; _i++) {
        var cell = _cellsCanEat[_i];
        var depth = this.pathDepth(this.canEatLargestPaths(cell)[0]);

        if (depth > maxDepth) {
          this.cellsCanEat = [];
          maxDepth = depth;
          this.cellsCanEat.push(cell);
        } else if (depth === maxDepth) {
          this.cellsCanEat.push(cell);
        }
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.cellsCanEat[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _cell = _step.value;

          _cell.makeCanEat();
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
    }
  }, {
    key: "forAllCells",
    value: function forAllCells(callback) {
      for (var row = 0; row < 8; row++) {
        for (var column = 0; column < 8; column++) {
          var cell = this.boardCells[row][column];
          callback(cell);
        }
      }
    } // render(){
    //     this.forAllCells(cell => {
    //         let dama = cell.dama;
    //
    //         if(dama === null) return;
    //
    //         dama.row = cell.row;
    //         dama.column = cell.column;
    //     });
    // }

  }, {
    key: "rowCells",
    value: function rowCells(row) {
      return this.boardCells[row];
    }
  }, {
    key: "columnCells",
    value: function columnCells(column) {
      var columnArray = [];
      this.boardCells.map(function (rowArray, row) {
        columnArray.push(rowArray[column]);
      });
      return columnArray;
    }
  }, {
    key: "aboveEmptyCells",
    value: function aboveEmptyCells(cell) {
      if (cell === undefined) return undefined;
      var row = cell.row;
      var columnCells = this.columnCells(cell.column);
      var aboveEmptyCells = [];

      for (var _row = cell.row - 1; _row >= 0; _row--) {
        var columnCell = columnCells[_row];
        if (columnCell.dama !== null) break;

        if (columnCell.row < cell.row) {
          aboveEmptyCells.push(columnCell);
        }
      }

      return aboveEmptyCells;
    }
  }, {
    key: "aboveCell",
    value: function aboveCell(cell) {
      var steps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      if (cell === undefined) return undefined;
      var columnCells = this.columnCells(cell.column);
      return columnCells[cell.row - steps];
    } //returns the above cell with dama, used for king's

  }, {
    key: "aboveNeighborCell",
    value: function aboveNeighborCell(cell) {
      var row = cell.row;
      var columnCells = this.columnCells(cell.column);

      for (var _row2 = cell.row - 1; _row2 >= 0; _row2--) {
        var columnCell = columnCells[_row2];
        if (columnCell.row < cell.row && columnCell.dama !== null) return columnCell;
      }
    }
  }, {
    key: "belowEmptyCells",
    value: function belowEmptyCells(cell) {
      if (cell === undefined) return undefined;
      var row = cell.row;
      var columnCells = this.columnCells(cell.column);
      var belowEmptyCells = [];

      for (var _row3 = cell.row + 1; _row3 < columnCells.length; _row3++) {
        var columnCell = columnCells[_row3];
        if (columnCell.dama !== null) break;

        if (columnCell.row > cell.row) {
          belowEmptyCells.push(columnCell);
        }
      }

      return belowEmptyCells;
    }
  }, {
    key: "belowCell",
    value: function belowCell(cell) {
      var steps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      if (cell === undefined) return undefined;
      var columnCells = this.columnCells(cell.column);
      return columnCells[cell.row + steps];
    } //returns the below cell with dama, used for king's

  }, {
    key: "belowNeighborCell",
    value: function belowNeighborCell(cell) {
      var row = cell.row;
      var columnCells = this.columnCells(cell.column);

      for (var _row4 = cell.row + 1; _row4 < columnCells.length; _row4++) {
        var columnCell = columnCells[_row4];
        if (columnCell.row > cell.row && columnCell.dama !== null) return columnCell;
      }
    }
  }, {
    key: "rightEmptyCells",
    value: function rightEmptyCells(cell) {
      if (cell === undefined) return undefined;
      var column = cell.column;
      var rowCells = this.rowCells(cell.row);
      var rightEmptyCells = [];
      if (rowCells.length === 0) return rightEmptyCells;

      for (var _column = cell.column + 1; _column < rowCells.length; _column++) {
        var rowCell = rowCells[_column];
        if (rowCell.dama !== null) break;

        if (rowCell.column > cell.column) {
          rightEmptyCells.push(rowCell);
        }
      }

      return rightEmptyCells;
    }
  }, {
    key: "rightCell",
    value: function rightCell(cell) {
      var steps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      if (cell === undefined) return undefined;
      var rowCells = this.rowCells(cell.row);
      return rowCells[cell.column + steps];
    } //returns the right cell with dama, used for king's

  }, {
    key: "rightNeighborCell",
    value: function rightNeighborCell(cell) {
      var column = cell.column;
      var rowCells = this.rowCells(cell.row);

      for (var _column2 = cell.column + 1; _column2 < rowCells.length; _column2++) {
        var rowCell = rowCells[_column2];
        if (rowCell.column > cell.column && rowCell.dama !== null) return rowCell;
      }
    }
  }, {
    key: "leftEmptyCells",
    value: function leftEmptyCells(cell) {
      if (cell === undefined) return undefined;
      var column = cell.column;
      var rowCells = this.rowCells(cell.row);
      var leftEmptyCells = [];
      if (rowCells.length === 0) return leftEmptyCells;

      for (var _column3 = cell.column - 1; _column3 >= 0; _column3--) {
        var rowCell = rowCells[_column3];
        if (rowCell.dama !== null) break;

        if (rowCell.column < cell.column) {
          leftEmptyCells.push(rowCell);
        }
      }

      return leftEmptyCells;
    }
  }, {
    key: "leftCell",
    value: function leftCell(cell) {
      var steps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      if (cell === undefined) return undefined;
      var rowCells = this.rowCells(cell.row);
      return rowCells[cell.column - steps];
    } //returns the right cell with dama, used for king's

  }, {
    key: "leftNeighborCell",
    value: function leftNeighborCell(cell) {
      var column = cell.column;
      var rowCells = this.rowCells(cell.row);

      for (var _column4 = cell.column - 1; _column4 >= 0; _column4--) {
        var rowCell = rowCells[_column4];
        if (rowCell.column < cell.column && rowCell.dama !== null) return rowCell;
      }
    }
  }, {
    key: "isTopRow",
    value: function isTopRow(cell) {
      if (cell.dama.type === 'black') return cell.dama.row === 7;else if (cell.dama.type === 'yellow') return cell.dama.row === 0;
    }
  }, {
    key: "cellsToMoveTo",
    value: function cellsToMoveTo(cell) {
      var dama = cell.dama;
      var cellsToCheck = [];
      var cellsToMoveTo = [];
      if (!dama.king) {
        if (dama.type === 'yellow') cellsToCheck = [this.aboveCell(cell), this.rightCell(cell), this.leftCell(cell)];else cellsToCheck = [this.belowCell(cell), this.rightCell(cell), this.leftCell(cell)];
      } else if (dama.king) cellsToCheck = this.aboveEmptyCells(cell).concat(this.rightEmptyCells(cell)).concat(this.belowEmptyCells(cell)).concat(this.leftEmptyCells(cell));
      cellsToCheck = removeUndefined(cellsToCheck);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = cellsToCheck[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var cellToCheck = _step2.value;
          //not out of bound
          if (cellToCheck.dama === null) cellsToMoveTo.push(cellToCheck);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return cellsToMoveTo;
    }
  }, {
    key: "cellsToEatObj",
    value: function cellsToEatObj(cell) {
      var dama = cell.dama;
      var cellsToEatObj = []; //{ cellToEat: CELL, playableTo: CELL }

      var neighborCells = [];
      var afterNeighborCellsArr = [];

      if (!dama.king) {
        if (dama.type === 'yellow') {
          neighborCells = [this.aboveCell(cell), this.rightCell(cell), this.leftCell(cell)];
          afterNeighborCellsArr = [[this.aboveCell(cell, 2)], [this.rightCell(cell, 2)], [this.leftCell(cell, 2)]];
        } else {
          neighborCells = [this.belowCell(cell), this.rightCell(cell), this.leftCell(cell)];
          afterNeighborCellsArr = [[this.belowCell(cell, 2)], [this.rightCell(cell, 2)], [this.leftCell(cell, 2)]];
        }
      } else if (dama.king) {
        var lstDirAbove = this.lastEatDirection === 'above';
        var lstDirRight = this.lastEatDirection === 'right';
        var lstDirLeft = this.lastEatDirection === 'left';
        var lstDirBelow = this.lastEatDirection === 'below'; // console.log(lstDirAbove, lstDirRight, lstDirLeft, lstDirBelow);

        neighborCells = [this.aboveNeighborCell(cell), this.rightNeighborCell(cell), this.belowNeighborCell(cell), this.leftNeighborCell(cell)];
        afterNeighborCellsArr = [this.aboveEmptyCells(neighborCells[0]), this.rightEmptyCells(neighborCells[1]), this.belowEmptyCells(neighborCells[2]), this.leftEmptyCells(neighborCells[3])]; // console.log(this.lastEatDirection);

        if (lstDirAbove) {
          neighborCells.splice(2, 1);
          afterNeighborCellsArr.splice(2, 1);
        } else if (lstDirRight) {
          neighborCells.splice(3, 1);
          afterNeighborCellsArr.splice(3, 1);
        } else if (lstDirLeft) {
          neighborCells.splice(1, 1);
          afterNeighborCellsArr.splice(1, 1);
        } else if (lstDirBelow) {
          neighborCells.splice(0, 1);
          afterNeighborCellsArr.splice(0, 1);
        }
      } // console.log(neighborCells);
      // console.log(afterNeighborCellsArr);


      for (var i = 0; i < neighborCells.length; i++) {
        var neighborCell = neighborCells[i];
        var afterNeighborCells = afterNeighborCellsArr[i];

        if (neighborCell !== undefined) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = afterNeighborCells[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var afterNeighborCell = _step3.value;

              if (afterNeighborCell !== undefined) {
                //Have neighborCell and afterNeighborCell
                if (neighborCell.dama !== null) {
                  if (cell.oppositeOf(neighborCell) && afterNeighborCell.dama === null) {
                    cellsToEatObj.push({
                      'cellToEat': neighborCell,
                      'playableTo': afterNeighborCell
                    });
                  }
                }
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                _iterator3["return"]();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }
      }

      return cellsToEatObj;
    }
  }, {
    key: "takeMove",
    value: function takeMove(cell, eatMove) {
      var cellToEat = eatMove.cellToEat;
      var playableTo = eatMove.playableTo;
      cellToEat.removeDama();
      this.move(cell, playableTo);
      this.lastEatDirection = this.relation(cellToEat, cell);
    }
  }, {
    key: "canEatPath",
    value: function canEatPath(cell, oBoardCellsRef) {
      // console.log(oBoardCellsRef);
      var oldCellRef = cell; //original cell

      var oldBoardCellsRef = this.boardCells; //original this.boardCells

      this.boardCells = _.cloneDeep(oldBoardCellsRef);
      var vCell = this.boardCells[cell.row][cell.column];
      var subPaths = this.cellsToEatObj(vCell);
      var newPaths = [];

      for (var i = 0; i < subPaths.length; i++) {
        var eatMove = subPaths[i];
        this.boardCells = _.cloneDeep(oldBoardCellsRef);
        var _vCell = this.boardCells[cell.row][cell.column]; //update vCell to the clone cells
        //update eatMoveObject

        eatMove.cellToEat = this.boardCells[eatMove.cellToEat.row][eatMove.cellToEat.column];
        eatMove.playableTo = this.boardCells[eatMove.playableTo.row][eatMove.playableTo.column];
        this.takeMove(_vCell, eatMove);
        var originalEatMove = {
          cellToEat: oBoardCellsRef[eatMove.cellToEat.row][eatMove.cellToEat.column],
          playableTo: oBoardCellsRef[eatMove.playableTo.row][eatMove.playableTo.column]
        }; //the one in the original this.boardCells

        newPaths.push({
          move: originalEatMove,
          paths: this.canEatPath(eatMove.playableTo, oBoardCellsRef)
        });
      }

      return newPaths;
    }
  }, {
    key: "canEatPaths",
    value: function canEatPaths(cell) {
      var oldBoardCellsRef = this.boardCells; //original this.boardCells
      // let oldLastEatDirection = this.lastEatDirection;

      var paths = this.canEatPath(cell, oldBoardCellsRef);
      this.lastEatDirection = null;
      this.boardCells = oldBoardCellsRef; //as nothing happened
      // this.lastEatDirection = oldLastEatDirection; //as nothing happened

      return paths;
    }
  }, {
    key: "pathDepth",
    value: function pathDepth(pathsObj) {
      var paths = pathsObj.paths;
      if (paths.length === 0) return 0;else {
        var maxDepth = 0;
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = paths[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var path = _step4.value;
            var depth = this.pathDepth(path);
            if (depth > maxDepth) maxDepth = depth;
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
              _iterator4["return"]();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        return 1 + maxDepth;
      }
    }
  }, {
    key: "canEatLargestPaths",
    value: function canEatLargestPaths(cell) {
      var paths = this.canEatPaths(cell); // console.log(paths);

      var maxDepth = -1;
      var largestPaths = [];
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = paths[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var path = _step5.value;
          var depth = this.pathDepth(path);

          if (depth > maxDepth) {
            maxDepth = depth;
            largestPaths = []; //clear

            largestPaths.push(path);
          } else if (depth === maxDepth) {
            largestPaths.push(path);
          }
        } // console.log(largestPaths);
        // console.log('max depth: ', maxDepth);
        // console.table(largestPaths);
        // console.log(largestPaths[0].move.playableTo);

      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return largestPaths;
    }
  }, {
    key: "relation",
    value: function relation(cell1, cell2) {
      if (cell1.row > cell2.row) return 'below';else if (cell1.row < cell2.row) return 'above';else if (cell1.column > cell2.column) return 'right';else if (cell1.column < cell2.column) return 'left';
    }
  }, {
    key: "clearAvailableMoves",
    value: function clearAvailableMoves() {
      this.forAllCells(function (cell) {
        cell.removePlayable();
      });
    } //receives cell with dama only

  }, {
    key: "showAvailableMoves",
    value: function showAvailableMoves(cell) {
      this.clearAvailableMoves();
      var cellsToEatObj = this.canEatLargestPaths(cell).map(function (obj) {
        return obj.move;
      }); //gets the largest eatable path and return the first moves.

      var canEat = cellsToEatObj.length > 0;

      if (canEat) {
        var cellsToEat = cellsToEatObj.map(function (obj) {
          return obj.cellToEat;
        });
        var cellsPlayableTo = cellsToEatObj.map(function (obj) {
          return obj.playableTo;
        });

        for (var i = 0; i < cellsToEat.length; i++) {
          var cellToEat = cellsToEat[i];
          var cellPlayableTo = cellsPlayableTo[i];
          cellPlayableTo.makePlayable(cell);
          cellPlayableTo.makePlayableToEat(cellToEat);
        }
      } else if (!canEat) {
        var cellsToMoveTo = this.cellsToMoveTo(cell);
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = cellsToMoveTo[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var cellToMoveTo = _step6.value;
            cellToMoveTo.makePlayable(cell);
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
              _iterator6["return"]();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }
      }
    }
  }, {
    key: "handleEmptyCellClick",
    value: function handleEmptyCellClick(cell) {
      if (cell.playable) {
        var playableForCell = cell.playableFor;
        var canEat = cell.toEat !== null;

        if (canEat) {
          this.lastEatDirection = this.relation(cell.toEat, playableForCell);
          cell.toEat.removeDama();
          this.sendCommand({
            command: 'removeDama',
            payload: {
              cell: {
                row: cell.toEat.row,
                column: cell.toEat.column
              }
            }
          });
        }

        this.move(playableForCell, cell); //TODO:: to do when moved, this real move

        this.onMove(playableForCell, cell);
        if (this.isTopRow(cell)) cell.dama.makeKing();
        this.clearAvailableMoves();
        var hasEaten = canEat === true;
        var canEatAgain = this.cellsToEatObj(cell).length > 0;

        if (hasEaten && canEatAgain) {
          //TODO:: to optimize, put it in a separate nested if (for canEatAgain)
          // this.forcePlayCell = cell;
          this.showAvailableMoves(cell);
        } else {
          // this.forcePlayCell = null;
          this.flipTurn();
          this.sendCommand({
            command: 'flipTurn',
            payload: {}
          });
        }
      }
    }
  }, {
    key: "cellOnClick",
    value: function cellOnClick(cell) {
      // console.log('online: ', this.online);
      // console.log(this.turnType, this.userType);
      if (this.online === true && this.turnType !== this.userType) return false;

      if (cell.dama !== null && this.turnType === cell.dama.type) {
        //FIXME:: ENABLE THIS
        // if(cell.dama !== null)
        if (this.cellsCanEat.length === 0) {
          this.showAvailableMoves(cell);
        } else {
          if (this.cellsCanEat.includes(cell)) {
            this.showAvailableMoves(cell);
          }
        }
      } else this.handleEmptyCellClick(cell); //TODO:: check the whole movedCells, so all the rows and column contained in the move
      //TODO:: is will be a square or rectangle, check all if can eat,
      //TODO:: using a mre optimized method, and save all cells that can eat in variable
      //TODO:: then force the player to play only those cells

    }
  }, {
    key: "cell",
    value: function cell(dama) {
      return this.boardCells[dama.row][dama.column];
    }
  }, {
    key: "sendCommand",
    value: function sendCommand(commandObj) {
      socket.emit('command', commandObj);
    }
  }, {
    key: "executeCommand",
    value: function executeCommand(commandObj) {
      // console.log(commandObj);
      var command = commandObj.command;
      var payload = commandObj.payload;

      if (command === 'move') {
        var cellFrom = this.boardCells[payload.cellFrom.row][payload.cellFrom.column];
        var cellTo = this.boardCells[payload.cellTo.row][payload.cellTo.column]; // console.log('Move: ', cellFrom, cellTo);

        this.move(cellFrom, cellTo);
        if (this.isTopRow(cellTo)) cellTo.dama.makeKing();
      }

      if (command === 'flipTurn') {
        // console.log('Turn flipped: ', this.turnType);
        this.flipTurn();
      }

      if (command === 'removeDama') {
        var cell = this.boardCells[payload.cell.row][payload.cell.column]; // console.log('remove dama: ', cell);

        cell.removeDama();
      }
    }
  }, {
    key: "onMove",
    value: function onMove(cellFrom, cellTo) {
      // console.log('Move: ', cellFrom, cellTo);
      var cellFromPortable = {
        row: cellFrom.row,
        column: cellFrom.column
      };
      var cellToPortable = {
        row: cellTo.row,
        column: cellTo.column
      };
      this.sendCommand({
        command: 'move',
        payload: {
          cellFrom: cellFromPortable,
          cellTo: cellToPortable
        }
      });
    }
  }, {
    key: "move",
    value: function move(cellFrom, cellTo) {
      cellFrom.dama.moveTo(cellTo.row, cellTo.column);
      cellTo.dama = cellFrom.dama;
      cellFrom.dama = null;
    }
  }, {
    key: "moveWithoutAnimation",
    value: function moveWithoutAnimation(cellFrom, cellTo) {
      cellTo.dama = cellFrom.dama;
      cellFrom.dama = null;
    }
  }]);

  return Board;
}();

var Game = /*#__PURE__*/function () {
  function Game(online, userType) {
    _classCallCheck(this, Game);

    this.online = online;
    this.userType = userType;
    var board = document.getElementById('board');
    this.piecesContainer = document.getElementById('pieces-container');
    this.piecesContainer.appendChild(app.view);
    loader.add("assets/spritesheet.v1.json").load(this.spriteLoaded.bind(this));
  }

  _createClass(Game, [{
    key: "showWinScreen",
    value: function showWinScreen() {
      var winScreen = document.getElementById('win');
      winScreen.style.display = 'flex';
      console.log('win: ', this.board.turnType);
    }
  }, {
    key: "onWin",
    value: function onWin() {
      this.showWinScreen();
    }
  }, {
    key: "spriteLoaded",
    value: function spriteLoaded() {
      this.board = new Board(this.online, this.userType, this.onWin, this);
    }
  }]);

  return Game;
}();
//# sourceMappingURL=Game.js.map