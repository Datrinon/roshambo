"use strict"
// necessary functions
// computerPlay, playRound, game

const CHOICES = Object.freeze({ ROCK: 0, PAPER: 1, SCISSOR: 2 });
const GAME_STATES = Object.freeze({ WIN: "Player wins the round!", LOSE: "Computer wins the round!", TIE: "Tie!" });
const ROUNDS = 5;

const captionText = document.querySelector("#record-log > p");
const buttons = document.querySelectorAll(".choice");

let roundsPlayed = 0;
let playerScore = 0;
let cpuScore = 0;


function getCPUInput() {
    let selection = Math.floor(Math.random() * Object.keys(CHOICES).length);

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

function endGame() {

    let gameOverMessage = " Game over!";

    if (playerScore > cpuScore) {
        captionText.textContent = "Player wins!";
    } else if (playerScore < cpuScore) {
        captionText.textContent = "Computer wins!";
    } else {
        captionText.textContent = "Stalemate! Nobody wins!";
    }

    captionText.textContent += gameOverMessage;
    captionText.classList.toggle("last-record-message");


    const recordTextDiv = document.querySelector("#record-log");
    recordTextDiv.insertBefore(captionText, recordTextDiv.querySelector("p"));

    // document.querySelector("#dialog").textContent = "Refresh the page to play again.";

    // create replay button
    const replayButton = document.createElement("button");
    replayButton.id = "replay-button";
    replayButton.textContent = "Play again";
    // replace guide text
    document.querySelector("#display").replaceChild(replayButton, document.querySelector("#dialog"));
    // add handler
    replayButton.addEventListener("click", resetGame);


    // disable buttons.
    buttons.forEach(button => {
        button.setAttribute("disabled", "");
    })
}

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
        // playerScoreText.after(winAnimationText);
        playerScoreText.parentNode.appendChild(winAnimationText);
        winAnimationText.addEventListener("animationend", (e) => {
            console.log(e.target);
            console.log(e.currentTarget);
            e.currentTarget.parentNode.removeChild(e.currentTarget);
            //e.target.remove();
        });
        
    } else if (result == GAME_STATES.LOSE) {
        cpuScore++;
        // cpuScoreText.parentNode.appendChild(winAnimationText);
        cpuScoreText.after(winAnimationText);
        winAnimationText.addEventListener("animationend", (e) => {
            console.log(e.target);
            console.log(e.currentTarget);
            e.currentTarget.parentNode.removeChild(e.currentTarget);
            // e.target.remove();
        });
    }

    playerScoreText.textContent = playerScore;
    cpuScoreText.textContent = cpuScore;
    captionText.textContent = result;
}

function recordHistory(result) {
    const recordTextDiv = document.querySelector("#record-log");
    if (recordTextDiv.classList.contains("record-empty")) {
        recordTextDiv.classList.toggle("record-empty");
        recordTextDiv.removeChild(recordTextDiv.querySelector("p")); // clear records
    }

    let matchResultMessage = document.createElement("p");
    matchResultMessage.textContent = `Round ${roundsPlayed}: ${result}`;

    if (recordTextDiv.hasChildNodes()) {
        recordTextDiv.insertBefore(matchResultMessage, recordTextDiv.querySelector("p"));
    } else {
        recordTextDiv.appendChild(matchResultMessage);
    }

}

function playRound(e) {

    roundsPlayed++;

    console.log(this);

    let roundResult;
    let playerInput = getUserInput(+this.dataset.key); // need to pass user input as a callback because it's a button.
    let cpuInput = getCPUInput();

    let playerInputDescription = getKeyByValue(CHOICES, playerInput);
    let cpuInputDescription = getKeyByValue(CHOICES, cpuInput);

    console.log(`Player settled on ${playerInputDescription} against the computer's ${cpuInputDescription}!`);

    // we use the enum we created up above to make the win conditions clearer.
    if ((playerInput == CHOICES.ROCK && cpuInput == CHOICES.SCISSOR) ||
        (playerInput == CHOICES.PAPER && cpuInput == CHOICES.ROCK) ||
        (playerInput == CHOICES.SCISSOR && cpuInput == CHOICES.PAPER)
    ) {
        roundResult = GAME_STATES.WIN;
    } else if (playerInput == cpuInput) {
        roundResult = GAME_STATES.TIE;
        // any other condition is a LOSS.
    } else {
        roundResult = GAME_STATES.LOSE;
    }

    assignScore(roundResult);
    recordHistory(roundResult);
    if (roundsPlayed >= ROUNDS) {
        endGame();
    }
}

function resetGame() {
    // reset scores
    roundsPlayed = 0;
    playerScore = 0;
    cpuScore = 0;

    const playerScoreText = document.querySelector("#player-score");
    const cpuScoreText = document.querySelector("#cpu-score");

    playerScoreText.textContent = playerScore;
    cpuScoreText.textContent = cpuScore;

    // reset log
    const recordTextDiv = document.querySelector("#record-log");
    while (recordTextDiv.firstChild) {
        recordTextDiv.removeChild(recordTextDiv.firstChild);
    }

    const recordEmptyMsg = document.createElement("p");
    recordEmptyMsg.textContent = "No rounds played yet."
    recordTextDiv.appendChild(recordEmptyMsg);
    recordTextDiv.classList.toggle("record-empty");

    // remove replay button and replace with default text.
    const dialog = document.createElement("p");
    dialog.id = "dialog";
    dialog.textContent = "Select an option.";

    document.querySelector("#replay-button").replaceWith(dialog);

    // enable buttons again.
    buttons.forEach(button => {
        button.removeAttribute("disabled");
    })


}

function onLoad() {
    const matchInfoText = document.querySelector("#match-info");
    matchInfoText.textContent = `Best of ${ROUNDS}`;

    buttons.forEach((button) => {
        button.addEventListener("click", playRound);
    });



    // playRound() 
    // - get user input

    //runGame();
}

onLoad();
