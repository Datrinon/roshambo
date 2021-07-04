"use strict"
// necessary functions
// computerPlay, playRound, game

const CHOICES = Object.freeze({ ROCK: 0, PAPER: 1, SCISSOR: 2 });
const GAME_STATES = Object.freeze({ WIN: "Player wins the round!", LOSE: "Computer wins the round!", TIE: "Tie!" });
let rounds;
let bestOf;

const scoreboard = document.querySelector("#scoreboard");
const playerButtons = document.querySelectorAll(".player-button");
const playButton = document.querySelector("#play-button"); 
const dialog = document.querySelector("#dialog");

let userChoice;

let roundsPlayed = 0;
let playerScore = 0;
let cpuScore = 0;


function getCPUInput() {
    let selection = Math.floor(Math.random() * Object.keys(CHOICES).length);

    // highlight CPU's choice.
    document.querySelector(`#cpu-control > button[data-key="${selection+1}"]`)
    .classList.add("cpu-selected-button");

    return selection;
}


function getUserInput(userInput) {
    let choice = +userInput;

    console.log(`User chose ${choice}`);
    switch (choice) {
        case 1: case 2: case 3:
            console.log(`Converting to ${choice - 1}`)
            return choice - 1;
        default:
            console.log("Invalid choice");
    }
}


function getPlayerSelection(e) {

    // enable play button thru attr. removal.
    document.querySelector("#play-button").removeAttribute("disabled");

    let selectedClass = "selected-button"
    // remove selected button from the previous (if any)
    let prevSelected = document.querySelector(`.${selectedClass}`);

    if (prevSelected !== null) {
        prevSelected.classList.remove(selectedClass);
    }

    this.classList.add(selectedClass);

    // get the user input too.
    userChoice = getUserInput(this.dataset.key);
}


/**
 * Assigns score to winner, or none if there's a tie. Then, it updates the scoreboard 
 * element.
 * @param {*} result - The outcome of the game -- win, lose, or tie.
 */
function assignScore(result) {
    const playerScoreText = document.querySelector("#player-score");
    const cpuScoreText = document.querySelector("#cpu-score");

    // move this in here otherwise multiple event listeners are assigned following 
    // a round completing with a victory for either the player or CPU.
    let winAnimationText = document.createElement("p");
    winAnimationText.textContent = "+1";
    winAnimationText.classList.add("add-score-active");

    if (result == GAME_STATES.WIN) {
        playerScore++;
        playerScoreText.after(winAnimationText);
        // playerScoreText.parentNode.appendChild(winAnimationText);
        winAnimationText.addEventListener("animationend", (e) => {
            e.currentTarget.parentNode.removeChild(e.currentTarget);
            //e.target.remove(); // works too.
        });

        document.querySelector(`.round${roundsPlayed}.player-point`)
        .classList.remove("point-hidden");

    } else if (result == GAME_STATES.LOSE) {
        cpuScore++;
        // cpuScoreText.parentNode.appendChild(winAnimationText);
        cpuScoreText.after(winAnimationText);
        winAnimationText.addEventListener("animationend", (e) => {
            e.currentTarget.parentNode.removeChild(e.currentTarget);
            // e.target.remove();
        });

        document.querySelector(`.round${roundsPlayed}.cpu-point`)
        .classList.remove("point-hidden");

    } else {

        document.querySelector(`.round${roundsPlayed}.tie-point`)
        .classList.remove("point-hidden");
    }

    playerScoreText.textContent = playerScore;
    cpuScoreText.textContent = cpuScore;
    dialog.textContent = result;
}



function playRound(e) {

    roundsPlayed++;

    console.log(this);

    let roundResult;
    // don't need to get user input, already retrieved in the function getUserInput as a global.
    let cpuInput = getCPUInput();
    
    let playerInputDescription = getKeyByValue(CHOICES, userChoice);
    let cpuInputDescription = getKeyByValue(CHOICES, cpuInput);

    console.log(`Player settled on ${playerInputDescription} against the computer's ${cpuInputDescription}!`);

    // we use the enum we created up above to make the win conditions clearer.
    if ((userChoice == CHOICES.ROCK && cpuInput == CHOICES.SCISSOR) ||
        (userChoice == CHOICES.PAPER && cpuInput == CHOICES.ROCK) ||
        (userChoice == CHOICES.SCISSOR && cpuInput == CHOICES.PAPER)) {
        roundResult = GAME_STATES.WIN;
    } else if (userChoice == cpuInput) {
        roundResult = GAME_STATES.TIE;
        // any other condition is a LOSS.
    } else {
        roundResult = GAME_STATES.LOSE;
    }

    assignScore(roundResult);

    cpuScore = 3;
    playerScore = 1;

    let bestOfAttained = ((cpuScore >= bestOf) || (playerScore >= bestOf));

    if (roundsPlayed >= rounds || bestOfAttained) {
        endGame();
    } else {
        endRound();
    }
}

/**
 * Ends the round by disabling buttons, placing a NEXT ROUND button,
 * removing active classes, and the current userChoice.
 */
function endRound() {
    // disable buttons
    
    playerButtons.forEach(btn => btn.setAttribute("disabled", ""));

    // create next round button.
    const nextButton = document.createElement("button");
    nextButton.id = "next-button";
    nextButton.textContent = "Next Round";
    nextButton.classList.add("button", "game-button");
    nextButton.addEventListener("click", (e) => {
        //remove user selected and cpu selected
        document.querySelectorAll(".controls button[class$='selected-button']").forEach(btn =>{
            btn.classList.remove("selected-button", "cpu-selected-button");
        })
        
        //reset choice with playButton (disabled)
        userChoice = null;
        e.target.replaceWith(playButton);
        playButton.setAttribute("disabled", "");

        dialog.textContent = "Select an option on the left.";

        // toggle the buttons again
        playerButtons.forEach(btn => btn.removeAttribute("disabled"));
    });

    document.querySelector("#game").replaceChild(nextButton, playButton);
}

function endGame() {

    let gameOverMessage = " Game over!";

    if (playerScore > cpuScore) {
        dialog.textContent = "Player wins!";
    } else if (playerScore < cpuScore) {
        dialog.textContent = "Computer wins!";
    } else {
        dialog.textContent = "Stalemate! Nobody wins!";
    }

    dialog.textContent += gameOverMessage;

    // disable buttons.
    playerButtons.forEach(btn => btn.removeAttribute("disabled"))

    // create replay button
    const replayButton = document.createElement("button");
    replayButton.id = "replay-button";
    replayButton.textContent = "Play again";
    replayButton.classList.add("button", "game-button");
    // replace guide text
    document.querySelector("#game").replaceChild(replayButton, playButton);
    // add handler
    replayButton.addEventListener("click", resetGame);
    
    // disable buttons.
    playerButtons.forEach(button => {
        button.setAttribute("disabled", "");
    })
}

// TODO: FIX THIS and replace recordTextDiv with scoreboard references
function resetGame() {

    // reset scores
    roundsPlayed = 0;
    playerScore = 0;
    cpuScore = 0;

        // get selectors
    const playerScoreText = document.querySelector("#player-score");
    const cpuScoreText = document.querySelector("#cpu-score");
    playerScoreText.textContent = playerScore;
    cpuScoreText.textContent = cpuScore;

    // reset log
    scoreboard.querySelectorAll(".point").forEach((p) => p.classList.add("point-hidden"));

    // reset dialog.
    dialog.textContent = "";

    document.querySelector("#replay-button").replaceWith(playButton);

    // reset selected buttons
    document.querySelectorAll(".controls button[class$='selected-button']").forEach(btn =>{
        btn.classList.remove("selected-button", "cpu-selected-button");
    })

    // enable buttons again.
    playerButtons.forEach(button => {
        button.removeAttribute("disabled");
    })


}

function loadScoreboard() {
    let rows = 'grid-template-rows: repeat(4, 1fr)'; // 3 + 1 round counter = 4
    let columns = `grid-template-columns: repeat(${rounds + 1}, 1fr)`;
    scoreboard.style.cssText=`display: grid; ${rows}; ${columns};`;

    let scoreboardTitle = document.createElement("h2");
    scoreboardTitle.textContent = "Record";
    scoreboardTitle.style.gridRow = "1 / 2";
    scoreboardTitle.style.gridColumn = `1 / ${rounds + 2}`;
    scoreboard.appendChild(scoreboardTitle);


    // Set round header
    for (let i = 0; i < rounds; i++) {
        let elem = document.createElement("p");
        elem.textContent = "" + (i + 1);
        elem.style.gridRow="2 / 3";
        elem.style.gridColumn=`${i + 2} / ${i + 3}`;
        scoreboard.appendChild(elem);
        elem.id = `round${i+1}-header`;

        // Set empty elements for each column.
        for (let j = 1; j <= 3; j++) {
            let cell = document.createElement("p"); 
            cell.textContent = "⦿";
            cell.style.gridRow = `${2 + j} / ${3 + j}`; // change rows each time
            cell.style.gridColumn = `${i + 2} / ${i + 3}`; // same grid column
            scoreboard.appendChild(cell);
            cell.classList.add(`round${i+1}`);
            cell.classList.add("point");
            cell.classList.add("point-hidden");
            if (j == 1) {
                cell.classList.add("player-point");
            } else if (j == 2) {
                cell.classList.add("tie-point");
            } else {
                cell.classList.add("cpu-point");
            }
        }
    }

    let scoreboardColumnHeaders = ["Player", "Tie", "CPU"];

    // Set the row headers
    for (let i = 0; i < 3; i++) {
        let elem = document.createElement("p");
        elem.textContent = scoreboardColumnHeaders[i];
        elem.style.cssText=`grid-row: ${i + 3} / ${i + 4}; grid-column: 1 / 2`;
        scoreboard.appendChild(elem);
    }
}

function startGame(e) {
    document.querySelector("#main-menu").classList.add("disable");

    document.addEventListener('animationend', (e) => {
        if (e.animationName === 'fadeout') {
                document.querySelector("#main-menu").style.display = "none";
                document.querySelector("#game").classList.add("enabled");
            }
        });
    
    rounds = document.getElementById("num-rounds-input").valueAsNumber ?? 5;
    loadScoreboard();

    // set best of rounds.
    bestOf = (Math.floor(rounds/2) + 1);
}

function onLoad() {
    
    document.getElementById("start-button").addEventListener("click", startGame);
        
    playerButtons.forEach(button => button.addEventListener("click", getPlayerSelection));

    playButton.addEventListener("click", playRound);


    // playRound() 
    // - get user input

    //runGame();
}

onLoad();
