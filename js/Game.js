const   loader = PIXI.Loader.shared,
    Sprite = PIXI.Sprite,
    TextureCache = PIXI.utils.TextureCache,
    app = new PIXI.Application({
        width: board.clientWidth,           // default: 800
        height: board.clientHeight,         // default: 600
        antialias: true,                    // default: false
        transparent: true,                  // default: false
        resolution: window.devicePixelRatio || 1,   // default: 1
        autoResize: true   // default: false
    }),
    cellSize = document.getElementsByClassName('cell')[0].getBoundingClientRect().width,
    cellPadding = cellSize * 0.15,
    damaSize = cellSize - cellPadding;

function removeUndefined(arr) {
    return arr.filter(cell => {
        return cell !== undefined;
    });
}

function getArrayDepth(value) {
    return Array.isArray(value) ?
        1 + Math.max(...value.map(getArrayDepth)) :
        0;
}

class Dama extends Sprite{
    constructor(type, row, column, king = false){
        let texture = null;

        let black = type === 'black';
        let yellow = type === 'yellow';

        if(black && !king)
            texture = TextureCache['BlackDama.v1.png'];
        else if(black && king)
            texture = TextureCache['BlackDamaKing.v1.png'];
        else if(yellow && !king)
            texture = TextureCache['YellowDama.v1.png'];
        else if(yellow && king)
            texture = TextureCache['YellowDamaKing.v1.png'];

        super(texture);

        this.anchor.set(0.5);

        this.type = type;
        this.row = row;
        this.column = column;

        king ? this.makeKing() : this.removeKing();

        this.width = damaSize;
        this.height = damaSize;

        this.vx = 0;
        this.vy = 0;

        app.stage.addChild(this);

        app.ticker.add(delta => {
            this.moveAnimate(delta)
        });
    }

    getTexture(){
        let black = this.type === 'black';
        let yellow = this.type === 'yellow';
        let king = this.king;

        if(black && !king)
            return TextureCache['BlackDama.v1.png'];
        else if(black && king)
            return TextureCache['BlackDamaKing.v1.png'];
        else if(yellow && !king)
            return TextureCache['YellowDama.v1.png'];
        else if(yellow && king)
            return TextureCache['YellowDamaKing.v1.png'];
    }

    makeKing(){
        this.king = true;

        this.texture = this.getTexture();
    }

    removeKing(){
        this.king = false;

        this.texture = this.getTexture();
    }

    rowY(row){
        return cellSize * row + cellSize / 2;
    }

    columnX(column){
        return cellSize * column + cellSize / 2;
    }

    moveAnimate(){
        let xTo = this.columnX(this.column);
        let yTo = this.rowY(this.row);

        let speed = 10;
        let stepX = speed;
        let stepY = speed;

        let xDiff = Math.abs(xTo - this.x);
        if (xDiff < speed)
            stepX = xDiff;

        let yDiff = Math.abs(yTo - this.y);
        if (yDiff < speed)
            stepY = yDiff;

        if(this.x < xTo)
            this.vx = stepX;
        else if(this.x > xTo)
            this.vx = stepX * -1;
        else
            this.vx = 0;

        if(this.y < yTo)
            this.vy = stepY;
        else if(this.y > yTo)
            this.vy = stepY * -1;
        else
            this.vy = 0;

        this.x += this.vx;
        this.y += this.vy;
    }

    moveTo(row, column){
        this.row = row;
        this.column = column;
    }
}

class Cell {
    constructor(dama, row, column, onClick, board){
        this.row = row;
        this.column = column;

        this.dama = dama;
        this.playable = false;
        this.playableFor = null;
        this.toEat = null; //the cell to eat

        this.canEat = false;

        this.cellElem = document.querySelector(`.row:nth-child( ${this.row + 1} ) .cell:nth-child( ${this.column + 1} )`);

        this.cellElem.onclick = onClick.bind(board, this);
    }

    makePlayable(playableFor){
        this.playable = true;
        this.playableFor = playableFor;
        this.cellElem.classList.add("playable");
    }
    removePlayable(){
        if(this.playable === true) { //to optimize (adding and removing class, on removeAvailableMoves())
            this.playable = false;
            this.playableFor = null;
            this.toEat = null; //important
            this.cellElem.classList.remove("playable");
        }
    }

    makePlayableToEat(toEat){
        this.toEat = toEat;
    }
    removePlayableToEat(toEat){
        this.toEat = null;
    }

    removeDama(){
        app.stage.removeChild(this.dama);
        this.dama = null;
    }
    removeDamaWithoutAnimation(){
        this.dama = null;
    }

    makeCanEat(){
        this.canEat = true;
        this.cellElem.classList.add("can-eat");
    }

    removeCanEat(){
        if(this.canEat === true) { //to optimize (adding and removing class, on removeAvailableMoves())
            this.canEat = false;
            this.cellElem.classList.remove("can-eat");
        }
    }


    oppositeOf(cell){
        return !(this.dama.type === cell.dama.type);
    }
}

class Board {
    constructor(online, userType, onWin, game){
        this.online = online;
        this.userType = userType;

        this.onWin = onWin.bind(game);

        // const piecesTypes = [
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

        socket.on('command', this.executeCommand.bind(this));

        // const piecesTypes = [
        //     [null, null, null, null, null, null, null, null],
        //     [null, null, null, null, null, null, null, null],
        //     [null, null, null, null, 'black', null, null, null],
        //     [null, null, null, null, null, null, null, null],
        //     [null, null, null, null, 'yellow', null, null, null],
        //     [null, null, null, null, null, null, null, null],
        //     [null, null, null, null, null, null, null, null],
        //     [null, null, null, null, null, null, null, null],
        // ];

        const piecesTypes = [
            [null, null, null, null, null, null, null, null],
            ['black', 'black', 'black', 'black', 'black', 'black', 'black', 'black'],
            ['black', 'black', 'black', 'black', 'black', 'black', 'black', 'black'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow'],
            ['yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow'],
            [null, null, null, null, null, null, null, null],
        ];

        this.turnType = 'yellow';
        this.lastEatDirection = null; //above, right, left, below

        this.forcePlayCell = null;
        this.cellsCanEat = [];

        let self = this;

        this.boardCells = piecesTypes.map((rowArray, row) => {
            return rowArray.map((damaType, column) => {
                let dama = null;

                if(damaType === null)
                    dama = null;
                else if(damaType === 'black')
                    dama = new Dama('black', row, column, false);
                else if(damaType === 'yellow')
                    dama = new Dama('yellow', row, column, false);

                return new Cell(dama, row, column, this.cellOnClick, self);
            });
        });
    }

    flipBoardCells(){
        // console.log('flip');
        // abc;

        for(let row = 0; row < 4; row++){
            for(let column = 0; column < 8; column++){
                let cell = this.boardCells[row][column];


                let flippedRow = 7 - cell.row;
                let flippedColumn = 7 - cell.column;

                let originalCell = this.boardCells[cell.row][cell.column];
                let flippedCell = this.boardCells[flippedRow][flippedColumn];

                this.boardCells[cell.row][cell.column] = flippedCell;
                this.boardCells[flippedRow][flippedColumn] = originalCell;
            }
        }
    }

    flipTurn(){
        let win = this.checkWin();
        
        if(win) {
            this.onWin();
            return;
        }

        // console.log('your turn');

        this.turnType === 'yellow' ? this.turnType = 'black' : this.turnType = 'yellow';

        this.lastEatDirection = null;

        this.updateCellsCanEat();
        //on each turn do something
    }

    checkWin(){
        let countYellow = 0;
        let countYellowMan = 0;
        let countYellowKing = 0;
        let countBlack = 0;
        let countBlackMan = 0;
        let countBlackKing = 0;

        this.forAllCells(cell => {
            let dama = cell.dama;

            if(dama !== null){
                if(dama.type === 'yellow') {
                    countYellow += 1;

                    if (!dama.king)
                        countYellowMan += 1;
                    else
                        countYellowKing += 1;
                }else {
                    countBlack += 1;

                    if (!dama.king)
                        countBlackMan += 1;
                    else
                        countBlackKing += 1;
                }
            }
        });

        // console.log('Yellow: ', countYellow);
        // console.log('Yellow Man: ', countYellowMan);
        // console.log('Yellow King: ', countYellowKing);
        // console.log('Black: ', countBlack);
        // console.log('Black Man: ', countBlackMan);
        // console.log('Black King: ', countBlackKing);

        if(countYellow === 0 || countBlack === 0)
            return true;

        if(countYellow === 1 && countYellowMan === 1 && countBlackKing === 1)
            return true;

        if(countBlack === 1 && countBlackMan === 1 && countYellowKing === 1)
            return true;

        return false;
    }

    updateCellsCanEat(){
        // console.log(this.lastEatDirection);

        let cellsCanEat = [];

        this.cellsCanEat = [];
        this.forAllCells(cell => {
            cell.removeCanEat();
        });

        this.forAllCells(cell => {
            if(cell.dama !== null && cell.dama.type === this.turnType){
                let canEat = this.cellsToEatObj(cell).length > 0;

                if(canEat) {
                    cellsCanEat.push(cell);
                    // console.log();
                }
            }
        });

        let maxDepth = -1;

        for(let cell of cellsCanEat){
            let depth = this.pathDepth(this.canEatLargestPaths(cell)[0]);

            if(depth > maxDepth){
                this.cellsCanEat = [];

                maxDepth = depth;
                this.cellsCanEat.push(cell);
            }else if(depth === maxDepth){
                this.cellsCanEat.push(cell);
            }
        }

        for(let cell of this.cellsCanEat){
            cell.makeCanEat();
        }

    }

    forAllCells(callback){
        for(let row = 0; row < 8; row++){
            for(let column = 0; column < 8; column++){
                let cell = this.boardCells[row][column];
                callback(cell);
            }
        }
    }

    // render(){
    //     this.forAllCells(cell => {
    //         let dama = cell.dama;
    //
    //         if(dama === null) return;
    //
    //         dama.row = cell.row;
    //         dama.column = cell.column;
    //     });
    // }

    rowCells(row){
        return this.boardCells[row];
    }
    columnCells(column){
        let columnArray = [];

        this.boardCells.map((rowArray, row) => {
            columnArray.push(rowArray[column]);
        });

        return columnArray;
    }

    aboveEmptyCells(cell){
        if(cell === undefined) return undefined;

        let row = cell.row;
        let columnCells = this.columnCells(cell.column);

        let aboveEmptyCells = [];

        for(let row = cell.row - 1; row >= 0; row--){
            let columnCell = columnCells[row];

            if(columnCell.dama !== null)
                break;

            if(columnCell.row < cell.row){
                aboveEmptyCells.push(columnCell);
            }
        }

        return aboveEmptyCells;
    }
    aboveCell(cell, steps = 1){
        if(cell === undefined) return undefined;

        let columnCells = this.columnCells(cell.column);
        return columnCells[cell.row - steps];
    }
    //returns the above cell with dama, used for king's
    aboveNeighborCell(cell){
        let row = cell.row;
        let columnCells = this.columnCells(cell.column);

        for(let row = cell.row - 1; row >= 0; row--){
            let columnCell = columnCells[row];

            if(columnCell.row < cell.row && columnCell.dama !== null)
                return columnCell;

        }
    }

    belowEmptyCells(cell){
        if(cell === undefined) return undefined;

        let row = cell.row;
        let columnCells = this.columnCells(cell.column);

        let belowEmptyCells = [];

        for(let row = cell.row + 1; row < columnCells.length; row++){
            let columnCell = columnCells[row];

            if(columnCell.dama !== null)
                break;

            if(columnCell.row > cell.row){
                belowEmptyCells.push(columnCell);
            }
        }

        return belowEmptyCells;
    }
    belowCell(cell, steps = 1){
        if(cell === undefined) return undefined;

        let columnCells = this.columnCells(cell.column);
        return columnCells[cell.row + steps];
    }
    //returns the below cell with dama, used for king's
    belowNeighborCell(cell){
        let row = cell.row;
        let columnCells = this.columnCells(cell.column);

        for(let row = cell.row + 1; row < columnCells.length; row++){
            let columnCell = columnCells[row];

            if(columnCell.row > cell.row && columnCell.dama !== null)
                return columnCell;

        }
    }

    rightEmptyCells(cell){
        if(cell === undefined) return undefined;

        let column = cell.column;
        let rowCells = this.rowCells(cell.row);

        let rightEmptyCells = [];

        if(rowCells.length === 0)
            return rightEmptyCells;

        for(let column = cell.column + 1; column < rowCells.length; column++){
            let rowCell = rowCells[column];

            if(rowCell.dama !== null)
                break;

            if(rowCell.column > cell.column){
                rightEmptyCells.push(rowCell);
            }
        }

        return rightEmptyCells;
    }
    rightCell(cell, steps = 1){
        if(cell === undefined) return undefined;

        let rowCells = this.rowCells(cell.row);
        return rowCells[cell.column + steps];
    }
    //returns the right cell with dama, used for king's
    rightNeighborCell(cell){
        let column = cell.column;
        let rowCells = this.rowCells(cell.row);

        for(let column = cell.column + 1; column < rowCells.length; column++){
            let rowCell = rowCells[column];

            if(rowCell.column > cell.column && rowCell.dama !== null)
                return rowCell;

        }
    }

    leftEmptyCells(cell){
        if(cell === undefined) return undefined;

        let column = cell.column;
        let rowCells = this.rowCells(cell.row);

        let leftEmptyCells = [];

        if(rowCells.length === 0)
            return leftEmptyCells;

        for(let column = cell.column - 1; column >= 0; column--){
            let rowCell = rowCells[column];

            if(rowCell.dama !== null)
                break;

            if(rowCell.column < cell.column){
                leftEmptyCells.push(rowCell);
            }
        }

        return leftEmptyCells;
    }
    leftCell(cell, steps = 1){
        if(cell === undefined) return undefined;

        let rowCells = this.rowCells(cell.row);
        return rowCells[cell.column - steps];
    }
    //returns the right cell with dama, used for king's
    leftNeighborCell(cell){
        let column = cell.column;
        let rowCells = this.rowCells(cell.row);

        for(let column = cell.column - 1; column >= 0; column--){
            let rowCell = rowCells[column];

            if(rowCell.column < cell.column && rowCell.dama !== null)
                return rowCell;

        }
    }

    isTopRow(cell){
        if(cell.dama.type === 'black')
            return cell.dama.row === 7;
        else if(cell.dama.type === 'yellow')
            return cell.dama.row === 0;
    }

    cellsToMoveTo(cell){
        let dama = cell.dama;

        let cellsToCheck = [];
        let cellsToMoveTo = [];

        if(!dama.king)
            if(dama.type === 'yellow')
                cellsToCheck = [this.aboveCell(cell), this.rightCell(cell), this.leftCell(cell)];
            else
                cellsToCheck = [this.belowCell(cell), this.rightCell(cell), this.leftCell(cell)];

        else if (dama.king)
            cellsToCheck = this.aboveEmptyCells(cell).concat(this.rightEmptyCells(cell)).concat(this.belowEmptyCells(cell)).concat(this.leftEmptyCells(cell));

        cellsToCheck = removeUndefined(cellsToCheck);

        for(let cellToCheck of cellsToCheck){
            //not out of bound
            if(cellToCheck.dama === null)
                cellsToMoveTo.push(cellToCheck);
        }


        return cellsToMoveTo;
    }
    cellsToEatObj(cell){
        let dama = cell.dama;

        let cellsToEatObj = [];//{ cellToEat: CELL, playableTo: CELL }

        let neighborCells = [];
        let afterNeighborCellsArr = [];

        if(!dama.king){
            if(dama.type === 'yellow') {
                neighborCells = [this.aboveCell(cell), this.rightCell(cell), this.leftCell(cell)];
                afterNeighborCellsArr = [[this.aboveCell(cell, 2)], [this.rightCell(cell, 2)], [this.leftCell(cell, 2)]];
            }else {
                neighborCells = [this.belowCell(cell), this.rightCell(cell), this.leftCell(cell)];
                afterNeighborCellsArr = [[this.belowCell(cell, 2)], [this.rightCell(cell, 2)], [this.leftCell(cell, 2)]];
            }

        }else if(dama.king){
            let lstDirAbove = this.lastEatDirection === 'above';
            let lstDirRight = this.lastEatDirection === 'right';
            let lstDirLeft = this.lastEatDirection === 'left';
            let lstDirBelow = this.lastEatDirection === 'below';

            // console.log(lstDirAbove, lstDirRight, lstDirLeft, lstDirBelow);

            neighborCells = [this.aboveNeighborCell(cell), this.rightNeighborCell(cell), this.belowNeighborCell(cell), this.leftNeighborCell(cell)];
            afterNeighborCellsArr = [this.aboveEmptyCells(neighborCells[0]), this.rightEmptyCells(neighborCells[1]), this.belowEmptyCells(neighborCells[2]), this.leftEmptyCells(neighborCells[3])];

            // console.log(this.lastEatDirection);

            if(lstDirAbove){
                neighborCells.splice(2, 1);
                afterNeighborCellsArr.splice(2, 1);
            }else if(lstDirRight){
                neighborCells.splice(3, 1);
                afterNeighborCellsArr.splice(3, 1);
            }else if(lstDirLeft){
                neighborCells.splice(1, 1);
                afterNeighborCellsArr.splice(1, 1);
            }else if(lstDirBelow){
                neighborCells.splice(0, 1);
                afterNeighborCellsArr.splice(0, 1);
            }
        }

        // console.log(neighborCells);
        // console.log(afterNeighborCellsArr);

        for(let i = 0; i < neighborCells.length; i++){
            let neighborCell = neighborCells[i];
            let afterNeighborCells = afterNeighborCellsArr[i];

            if(neighborCell !== undefined){
                for(let afterNeighborCell of afterNeighborCells){
                    if(afterNeighborCell !== undefined){
                        //Have neighborCell and afterNeighborCell

                        if(neighborCell.dama !== null){
                            if(cell.oppositeOf(neighborCell) && afterNeighborCell.dama === null) {
                                cellsToEatObj.push({
                                    'cellToEat': neighborCell,
                                    'playableTo': afterNeighborCell
                                });
                            }
                        }
                    }
                }
            }
        }

        return cellsToEatObj;
    }

    takeMove(cell, eatMove){
        let cellToEat = eatMove.cellToEat;
        let playableTo = eatMove.playableTo;

        cellToEat.removeDama();
        this.move(cell, playableTo);

        this.lastEatDirection = this.relation(cellToEat, cell);
    }

    canEatPath(cell, oBoardCellsRef){
        // console.log(oBoardCellsRef);

        let oldCellRef = cell; //original cell
        let oldBoardCellsRef = this.boardCells; //original this.boardCells

        this.boardCells = _.cloneDeep(oldBoardCellsRef);
        let vCell = this.boardCells[cell.row][cell.column];


        let subPaths = this.cellsToEatObj(vCell);



        let newPaths = [];

        for(let i = 0; i < subPaths.length; i++){
            let eatMove = subPaths[i];

            this.boardCells = _.cloneDeep(oldBoardCellsRef);

            let vCell = this.boardCells[cell.row][cell.column]; //update vCell to the clone cells

            //update eatMoveObject
            eatMove.cellToEat = this.boardCells[eatMove.cellToEat.row][eatMove.cellToEat.column];
            eatMove.playableTo = this.boardCells[eatMove.playableTo.row][eatMove.playableTo.column];

            this.takeMove(vCell, eatMove);

            let originalEatMove = {
                cellToEat: oBoardCellsRef[eatMove.cellToEat.row][eatMove.cellToEat.column],
                playableTo: oBoardCellsRef[eatMove.playableTo.row][eatMove.playableTo.column],
            };//the one in the original this.boardCells

            newPaths.push({
                move: originalEatMove,
                paths: this.canEatPath(eatMove.playableTo, oBoardCellsRef)
            });
        }

        return newPaths;
    }

    canEatPaths(cell){
        let oldBoardCellsRef = this.boardCells; //original this.boardCells
        // let oldLastEatDirection = this.lastEatDirection;

        let paths = this.canEatPath(cell, oldBoardCellsRef);
        this.lastEatDirection = null;

        this.boardCells = oldBoardCellsRef; //as nothing happened
        // this.lastEatDirection = oldLastEatDirection; //as nothing happened

        return paths;
    }

    pathDepth(pathsObj){
        let paths = pathsObj.paths;

        if(paths.length === 0)
            return 0;
        else{
            let maxDepth = 0;

            for(let path of paths){
                let depth = this.pathDepth(path);

                if(depth > maxDepth)
                    maxDepth = depth;
            }

            return 1 + maxDepth;
        }
    }

    canEatLargestPaths(cell){
        let paths = this.canEatPaths(cell);


        // console.log(paths);

        let maxDepth = -1;
        let largestPaths = [];

        for(let path of paths){
            let depth = this.pathDepth(path);

            if(depth > maxDepth){
                maxDepth = depth;
                largestPaths = []; //clear

                largestPaths.push(path);
            }else if (depth === maxDepth){
                largestPaths.push(path);
            }
        }
        // console.log(largestPaths);

        // console.log('max depth: ', maxDepth);
        // console.table(largestPaths);
        // console.log(largestPaths[0].move.playableTo);

        return largestPaths;
    }

    relation(cell1, cell2){
        if(cell1.row > cell2.row)
            return 'below';
        else if(cell1.row < cell2.row)
            return 'above';
        else if(cell1.column > cell2.column)
            return 'right';
        else if(cell1.column < cell2.column)
            return 'left';
    }

    clearAvailableMoves(){
        this.forAllCells(cell => {
            cell.removePlayable();
        });
    }
    //receives cell with dama only
    showAvailableMoves(cell) {
        this.clearAvailableMoves();

        let cellsToEatObj = this.canEatLargestPaths(cell).map(obj => obj.move); //gets the largest eatable path and return the first moves.
        let canEat = cellsToEatObj.length > 0;

        if(canEat){
            let cellsToEat = cellsToEatObj.map(obj => obj.cellToEat);
            let cellsPlayableTo = cellsToEatObj.map(obj => obj.playableTo);

            for(let i = 0; i < cellsToEat.length; i++) {

                let cellToEat = cellsToEat[i];
                let cellPlayableTo = cellsPlayableTo[i];

                cellPlayableTo.makePlayable(cell);
                cellPlayableTo.makePlayableToEat(cellToEat);
            }
        }else if(!canEat){
            let cellsToMoveTo = this.cellsToMoveTo(cell);
            for(let cellToMoveTo of cellsToMoveTo) {
                cellToMoveTo.makePlayable(cell);
            }
        }
    }

    handleEmptyCellClick(cell){
        if(cell.playable) {
            let playableForCell = cell.playableFor;

            let canEat = cell.toEat !== null;

            if(canEat) {
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

            if(this.isTopRow(cell))
                cell.dama.makeKing();

            this.clearAvailableMoves();

            let hasEaten = canEat === true;
            let canEatAgain = this.cellsToEatObj(cell).length > 0;

            if(hasEaten && canEatAgain) { //TODO:: to optimize, put it in a separate nested if (for canEatAgain)
                // this.forcePlayCell = cell;
                this.showAvailableMoves(cell);
            }else {
                // this.forcePlayCell = null;
                this.flipTurn();
                this.sendCommand({
                    command: 'flipTurn',
                    payload: {}
                });
            }
        }
    }
    cellOnClick(cell){
        // console.log('online: ', this.online);
        // console.log(this.turnType, this.userType);

        if(this.online === true && this.turnType !== this.userType)
            return false;

        if(cell.dama !== null && this.turnType === cell.dama.type) { //FIXME:: ENABLE THIS
            // if(cell.dama !== null)
            if(this.cellsCanEat.length === 0) {
                this.showAvailableMoves(cell);
            }else{
                if(this.cellsCanEat.includes(cell)) {
                    this.showAvailableMoves(cell);
                }
            }
        }else
            this.handleEmptyCellClick(cell);

        //TODO:: check the whole movedCells, so all the rows and column contained in the move
        //TODO:: is will be a square or rectangle, check all if can eat,
        //TODO:: using a mre optimized method, and save all cells that can eat in variable
        //TODO:: then force the player to play only those cells
    }

    cell(dama){
        return this.boardCells[dama.row][dama.column];
    }

    sendCommand(commandObj){
        socket.emit('command', commandObj);
    }

    executeCommand(commandObj){
        // console.log(commandObj);

        let command = commandObj.command;
        let payload = commandObj.payload;

        if(command === 'move'){
            let cellFrom = this.boardCells[payload.cellFrom.row][payload.cellFrom.column];
            let cellTo = this.boardCells[payload.cellTo.row][payload.cellTo.column];

            // console.log('Move: ', cellFrom, cellTo);
            this.move(cellFrom, cellTo);

            if(this.isTopRow(cellTo))
                cellTo.dama.makeKing();
        }

        if(command === 'flipTurn'){
            // console.log('Turn flipped: ', this.turnType);
            this.flipTurn();
        }

        if(command === 'removeDama'){
            let cell = this.boardCells[payload.cell.row][payload.cell.column];

            // console.log('remove dama: ', cell);
            cell.removeDama();
        }
    }

    onMove(cellFrom, cellTo){
        // console.log('Move: ', cellFrom, cellTo);

        let cellFromPortable = {
            row: cellFrom.row,
            column: cellFrom.column
        };

        let cellToPortable = {
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

    move(cellFrom, cellTo) {
        cellFrom.dama.moveTo(cellTo.row, cellTo.column);

        cellTo.dama = cellFrom.dama;
        cellFrom.dama = null;
    }

    moveWithoutAnimation(cellFrom, cellTo){
        cellTo.dama = cellFrom.dama;
        cellFrom.dama = null;
    }
}

class Game {
    constructor(online, userType) {
        this.online = online;
        this.userType = userType;

        const board = document.getElementById('board');

        this.piecesContainer = document.getElementById('pieces-container');
        this.piecesContainer.appendChild(app.view);

        loader
            .add("assets/spritesheet.v1.json")
            .load(this.spriteLoaded.bind(this));
    }

    showWinScreen(){
        let winScreen = document.getElementById('win');
        winScreen.style.display = 'flex';
        
        console.log('win: ', this.board.turnType);
    }
    
    onWin(){
        this.showWinScreen();
    }

    spriteLoaded(){
        this.board = new Board(this.online, this.userType, this.onWin, this);
    }
}