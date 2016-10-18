/* 

A SIMPLE TIC-TAC-TOE GAME IN JAVASCRIPT

(1) Grid layout

The game grid is represented in the array Grid.cells as follows:

[0] [1] [2]
[3] [4] [5]
[6] [7] [8]

The cells (array elements) hold the following numeric values:
0 if not occupied, 1 for player, 3 for computer.
This allows us to quickly get an overview of the game state: 
if the sum of all the cells in a row is 9, the computer wins,
if it is 3 and all the cells are occupied, the human player wins, 
etc.

(2) Strategy

*/

// GLOBAL VARIABLES
var moves = 0,
    winner = 0,
    x = 1,
    o = 3,
    player = x,
    computer = o,
    whoseTurn = player,
    gameOver = false,
    score = {
        ties: 0,
        player: 0,
        computer: 0
    },

    xText = "<span class=\"x\">&times;</class>",
    oText = "<span class=\"o\">&#9675;</class>",
    myGrid = null;

//==================================
// GRID OBJECT
//==================================

// Grid constructor
//=================
function Grid() {
    this.cells = new Array(9);
}

// Grid methods
//=============

// TODO: Delete this function; unused.
// Get the number of occupied cells
Grid.prototype.getOccupiedCellsNumber = function () {
    var i, count = 0;
    for (i = 0; i < this.cells.length; i++) {
        if (this.cells[i] > 0) {
            count++;
        }
    }
    return count;
};

// Get free cells in an array.
// Returns an array of indices in the original Grid.cells array, not the values
// of the array elements.
// Their values can be accessed as Grid.cells[index].
Grid.prototype.getFreeCellIndices = function () {
    var i = 0;
    var resultArray = [];
    for (i = 0; i < this.cells.length; i++) {
        if (this.cells[i] === 0) {
            resultArray.push(i);
        }
    }
    console.log("resultArray: " + resultArray.toString());
    // debugger;
    return resultArray;
};

// Get a row (accepts 0, 1, or 2 as argument).
// Returns the values of the elements.
Grid.prototype.getRowValues = function (index) {
    if (index !== 0 && index !== 1 && index !== 2) {
        return undefined;
    }
    var i = index * 3;
    // return this.cells.slice(i, 3); // does that work?
    return this.cells.slice(i, i + 3);
};

// get a row (accepts 0, 1, or 2 as argument)
// Returns an array with the indices, not their values
Grid.prototype.getRowIndices = function (index) {
    if (index !== 0 && index !== 1 && index !== 2) {
        return undefined;
    }
    var row = [];
    row.push(index);
    row.push(index + 3);
    row.push(index + 6);
    return row;
};

// get a column
Grid.prototype.getColumnValues = function (index) {
    if (index !== 0 && index !== 1 && index !== 2) {
        return undefined;
    }
    var i, column = [];
    for (i = index; i < this.cells.length; i += 3) {
        column.push(this.cells[i]);
    }
    return column;
};

// get a column
Grid.prototype.getColumnIndices = function (index) {
    if (index !== 0 && index !== 1 && index !== 2) {
        return undefined;
    }
    var i, column = [];
    for (i = index; i < this.cells.length; i += 3) {
        column.push(i);
    }
    return column;
};

// get diagonal cells
// arg 0: from top-left
// arg 1: from top-right
Grid.prototype.getDiagValues = function (arg) {
    var cells = [];
    if (arg !== 1 && arg !== 0) {
        return undefined;
    } else if (arg === 0) {
        cells.push(this.cells[0]);
        cells.push(this.cells[4]);
        cells.push(this.cells[8]);
    } else {
        cells.push(this.cells[2]);
        cells.push(this.cells[4]);
        cells.push(this.cells[6]);
    }
    return cells;
};

// get diagonal cells
// arg 0: from top-left
// arg 1: from top-right
Grid.prototype.getDiagIndices = function (arg) {
    if (arg !== 1 && arg !== 0) {
        return undefined;
    } else if (arg === 0) {
        return [0, 4, 8];
    } else {
        return [2, 4, 6];
    }
};

// Get first index with two in a row (accepts computer or player as first argument)
Grid.prototype.getFirstWithTwoInARow = function (agent) {
    if (agent !== computer && agent !== player) {
        return undefined;
    }
    var sum = agent * 2;
    var freeCells = shuffleArray(this.getFreeCellIndices());
    for (var i = 0; i < freeCells.length; i++) {
        for (var j = 0; j < 3; j++) {
            var rowV = this.getRowValues(j);
            var rowI = this.getRowIndices(j);
            var colV = this.getColumnValues(j);
            var colI = this.getColumnIndices(j);
            if (sumArray(rowV) == sum && isInArray(freeCells[i], rowI)) {
                return freeCells[i];
            } else if (sumArray(colV) == sum && isInArray(freeCells[i], colI)) {
                return freeCells[i];
            }
        }
        for (var j = 0; j < 2; j++) {
            var diagV = this.getDiagValues(j);
            var diagI = this.getDiagIndices(j);
            if (sumArray(diagV) == sum && isInArray(freeCells[i], diagI)) {
                return freeCells[i];
            }
        }
    }
    return false;
};

Grid.prototype.reset = function () {
    for (var i = 0; i < this.cells.length; i++) {
        this.cells[i] = 0;
    }
    return true;
};

//==================================
// EVENT CALLBACKS
//==================================
function initialize() {
    myGrid = new Grid();
    moves = 0;
    winner = 0;
    whoseTurn = player;
    gameOver = false;
    for (var i = 0; i <= myGrid.cells.length - 1; i++) {
        myGrid.cells[i] = 0;
    }
    // debugger;
}

function cellClicked(id) {
    // The last character of the id corresponds to the index in Grid.cells
    var idName = id.toString();
    var cell = parseInt(idName[idName.length - 1]);
    if (myGrid.cells[cell] > 0 || whoseTurn !== player || gameOver) {
        // cell is already occupied
        return false;
    }
    moves += 1;
    document.getElementById(id).innerHTML = xText;
    document.getElementById(id).style.cursor = "default";
    myGrid.cells[cell] = player;
    if (moves >= 5) {
        winner = checkWin();
    }
    if (winner === 0) {
        whoseTurn = computer;
        makeComputerMove();
    }
    return true;
}

function restartGame() {
    // TODO Sicherheitsabfrage
    gameOver = false;
    moves = 0;
    winner = 0;
    whoseTurn = player;
    myGrid.reset();
    for (var i = 0; i <= 8; i++) {
        var id = "cell" + i.toString();
        document.getElementById(id).innerHTML = "";
        document.getElementById(id).style.cursor = "pointer";
    }
}

function makeComputerMove() {
    // TODO ...
    // debugger;
    if (gameOver) {
        return false;
    }
    var cell = -1;
    var myArr = [];
    if (moves >= 3) {
        cell = myGrid.getFirstWithTwoInARow(player);
        if (!cell) {
            cell = myGrid.getFirstWithTwoInARow(computer);
        }
        if (!cell) {
            myArr = myGrid.getFreeCellIndices(); //TODO
            cell = myArr[intRandom(0, myArr.length - 1)];
        }
    } else {
        myArr = myGrid.getFreeCellIndices(); //TODO
        console.log("myArr: " + myArr);
        cell = myArr[intRandom(0, myArr.length - 1)];
    }
    console.log("cell = " + cell);
    var id = "cell" + cell.toString();
    console.log("computer chooses " + id);
    document.getElementById(id).innerHTML = oText;
    document.getElementById(id).style.cursor = "default";
    myGrid.cells[cell] = computer;
    moves += 1;
    if (moves >= 5) {
        winner = checkWin();
    }
    if (winner === 0 && !gameOver) {
        whoseTurn = player;
    }
}

function checkWin() {
    winner = 0;

    // rows
    for (var i = 0; i <= 2; i++) {
        var row = myGrid.getRowValues(i);
        if (row[0] > 0 && row[0] == row[1] && row[0] == row[2]) {
            if (row[0] == computer) {
                score.computer++;
                winner = computer;
                console.log("computer wins");
            } else {
                score.player++;
                winner = player;
                console.log("player wins");
            }
            endGame(winner);
            return winner;
        }
    }

    // columns
    for (var i = 0; i <= 2; i++) {
        var col = myGrid.getColumnValues(i);
        if (col[0] > 0 && col[0] == col[1] && col[0] == col[2]) {
            if (col[0] == computer) {
                score.computer++;
                winner = computer;
                console.log("computer wins");
            } else {
                score.player++;
                winner = player;
                console.log("player wins");
            }
            endGame(winner);
            return winner;
        }
    }

    // diagonals
    for (var i = 0; i <= 1; i++) {
        var diagonal = myGrid.getDiagValues(i);
        if (diagonal[0] > 0 && diagonal[0] == diagonal[1] && diagonal[0] == diagonal[2]) {
            if (diagonal[0] == computer) {
                score.computer++;
                winner = computer;
                console.log("computer wins");
            } else {
                score.player++;
                winner = player;
                console.log("player wins");
            }
            endGame(winner);
            return winner;
        }
    }

    // If we haven't returned a winner by now, if the board is full, it's a tie
    var myArr = myGrid.getFreeCellIndices();
    if (myArr.length === 0) {
        winner = 10;
        score.ties++;
        endGame(winner);
        return winner;
    }
}

function endGame(who) {
    if (who == 10) {
        alert("It's a tie!");
    } else if (who == computer) {
        alert("Computer wins!");
    } else {
        alert("Congratulations, you won!");
    }
    gameOver = true;
    whoseTurn = 0;
    moves = 0;
    winner = 0;
    document.getElementById("computer_score").innerHTML = score.computer;
    document.getElementById("tie_score").innerHTML = score.ties;
    document.getElementById("player_score").innerHTML = score.player;
    for (var i = 0; i <= 8; i++) {
        var id = "cell" + i.toString();
        document.getElementById(id).style.cursor = "default";
    }
}

//==================================
// HELPER FUNCTIONS
//==================================
function sumArray(array) {
    var sum = 0;
    for (var i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return sum;
}

function isInArray(element, array) {
    if (array.indexOf(element) > -1) {
        return true;
    }
    return false;
}

function shuffleArray(array) {
    var counter = array.length,
        temp, index;
    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

function intRandom(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}
