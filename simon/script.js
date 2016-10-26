// TODO: leiser, der Sound am Anfang ist zu laut
// TODO: timesRun und repetitions sind vermutlich dasselbe. JA!
// TODO: remove console.log() calls

"use strict";

/***********************************************************************
 GLOBAL VARIABLES
***********************************************************************/
var quarters = ["top-left", "top-right", "bottom-left", "bottom-right"],
    context = new AudioContext(),
    repetitions = 0, // Number of intended repetitions
    computerList = [], // This array is filled with random values later on
    playerList = [],
    playerScore = 0,
    user = 0, // The variables user and computer are just intuitive aliases for the numbers
    computer = 1,
    activePlayer = computer,
    loopCounter = 0,
    clickCounter = 0,
    computerLoopTimer = null,
    //timesRun = 0,
    maxRuns = 4, // TODO 20!
    looped = false;

/***********************************************************************
 HELPER FUNCTIONS
***********************************************************************/
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playSound(frequency) {
    var oscillator = context.createOscillator();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    oscillator.connect(context.destination);
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.45);
}

function setBackgroundColor(id, color) {
    document.getElementById(id).style.backgroundColor = color;
}

function removeClass(id, cssClass) {
    var str = " " + cssClass + "$",
        re = new RegExp(str, "g");
    document.getElementById(id).className = document.getElementById(id).className.replace(re, '');
}

function setCursorForQuarters(cursor) {
    var index = 0,
        id = "";
    for (index in quarters) {
        id = quarters[index];
        document.getElementById(id).style.cursor = cursor;
    }
}

/***********************************************************************
 CORE GAME FUNCTIONS
***********************************************************************/

// This function makes an individual quarter (identified by the id parameter) 
// glow and plays its corresponding sound
function flashQuarter(id) {
    document.getElementById(id).className += " glow";
    if (id === "top-left") {
        setBackgroundColor(id, "lawngreen");
        playSound(500);
        setTimeout(setBackgroundColor, 450, id, "darkgreen");
    } else if (id === "top-right") {
        document.getElementById(id).style.backgroundColor = "tomato";
        playSound(450);
        setTimeout(setBackgroundColor, 450, id, "darkred");
    } else if (id === "bottom-left") {
        document.getElementById(id).style.backgroundColor = "#ffff66";
        playSound(400);
        setTimeout(setBackgroundColor, 450, id, "goldenrod");
    } else if (id === "bottom-right") {
        document.getElementById(id).style.backgroundColor = "deepskyblue";
        playSound(350);
        setTimeout(setBackgroundColor, 450, id, "midnightblue");
    }
    setTimeout(removeClass, 450, id, "glow");
}

// This function flashes all quarters of the circle twice when the page loads
function flashAll() {
    var index = 0,
        id = "";
    playSound(550);
    setBackgroundColor("go", "deepskyblue");
    setTimeout(setBackgroundColor, 700, "go", "blue");
    for (index in quarters) {
        id = quarters[index];
        if (id === "top-left") {
            document.getElementById(id).className += " glow";
            setBackgroundColor(id, "lawngreen");
            setTimeout(setBackgroundColor, 700, id, "darkgreen");
            setTimeout(removeClass, 700, id, "glow");
            continue; // we found the right one, no need to test the other cases
        } else if (id === "top-right") {
            document.getElementById(id).className += " glow";
            setBackgroundColor(id, "tomato");
            setTimeout(setBackgroundColor, 700, id, "darkred");
            setTimeout(removeClass, 700, id, "glow");
            continue;
        } else if (id === "bottom-left") {
            document.getElementById(id).className += " glow";
            setBackgroundColor(id, "#ffff66");
            setTimeout(setBackgroundColor, 700, id, "goldenrod");
            setTimeout(removeClass, 700, id, "glow");
            continue;
        } else if (id === "bottom-right") {
            document.getElementById(id).className += " glow";
            setBackgroundColor(id, "deepskyblue");
            setTimeout(setBackgroundColor, 700, id, "midnightblue");
            setTimeout(removeClass, 700, id, "glow");
        }
    }
    // Play it a second time after 1000 milliseconds:
    if (!looped) {
        setTimeout(flashAll, 1000);
    }
    looped = true;
    activePlayer = user;
}

// Called from computerMoves; flashes the quarters stored in computerList
function loopQuarters() {
    console.log("loopCounter: " + loopCounter);
    console.log("computerList[loopCounter]: " + computerList[loopCounter]);
    console.log(quarters[computerList[loopCounter]]);
    flashQuarter(quarters[computerList[loopCounter]]);

    loopCounter++;

    // Clear interval after given number of repetitions
    if (loopCounter >= repetitions) {
        clearInterval(computerLoopTimer);
        loopCounter = 0;
        return;
    }
}

function computerMoves() {
    activePlayer = computer;
    loopCounter = 0;
    computerLoopTimer = setInterval(loopQuarters, 750);
    repetitions++;
    document.getElementById("repetitions").innerHTML = repetitions.toString();
    //timesRun++;
    activePlayer = user;
    setCursorForQuarters("pointer");
}

function initializeGame() {
    repetitions = 0;
    playerList = [];
    playerScore = 0;
    activePlayer = computer;
    loopCounter = 0;
    clickCounter = 0;
    //timesRun = 0;
    document.getElementById("repetitions").innerHTML = "--";
}

// Fill the computerList array with 20 random integers from 0 to 3
function initializeComputerList() {
    computerList = [];
    for (var i = 0; i < maxRuns; i++) {
        computerList.push(getRandomInt(0, 3));
    }
}

function goButtonClicked() {
    //console.log("activePlayer: " + activePlayer);
    // If it's not the user's turn, they have no business pressing the go button
    if (activePlayer === user) {
        // Ask for confirmation if a game is already running
        if (repetitions > 0) {
            var answer = confirm("Do you want to start over?");
            if (answer === true) {
                initializeGame();
                initializeComputerList();
                computerMoves();
            } else {
                return;
            }
        } else {
            initializeComputerList();
            // Set button to darker color
            document.getElementById("go").style.backgroundColor = "CornflowerBlue";
            computerMoves();
        }
    }
}

// This function is called whenever the player clicks one of the quarters
function quarterClicked(id) {
    // return early if it's not the player's turn
    if (activePlayer !== user) {
        console.log("returning");
        return;
    }
    flashQuarter(id);
    clickCounter++;
    playerList.push(id);
    console.log("clickCounter: " + clickCounter);
    console.log("quarters[computerList[clickCounter-1]]: " + quarters[computerList[clickCounter - 1]]);
    // Player makes a mistake
    if (id !== quarters[computerList[clickCounter - 1]]) {
        // repeat the old sequence if the user made a mistake
        //~alert("Wrong!");
        document.getElementById("repetitions").innerHTML = "!!";
        playSound(200);
        repetitions--; // repetitions is incremented in computerMoves.
        // document.getElementById("repetitions").innerHTML = repetitions.toString();
        activePlayer = computer;
        setTimeout(setCursorForQuarters, 500, "default");
        setTimeout(computerMoves, 1000);
        clickCounter = 0;
        return; // return early so the following isn't executed
    }
    // Player wins
    if (clickCounter == maxRuns)
    {
        document.getElementById("repetitions").innerHTML = "WIN";
        looped = true;
        //flashAll();
        setTimeout(initializeGame, 2500);
        initializeComputerList();
        setTimeout(computerMoves, 2800);
        return;
    }
    // Next round with one more flashing quarter
    if (clickCounter >= repetitions) {
        activePlayer = computer;
        setTimeout(setCursorForQuarters, 500, "default");
        setTimeout(computerMoves, 1000);
        clickCounter = 0;
        playerScore++;
    }
}
