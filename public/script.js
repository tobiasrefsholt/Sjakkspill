"use strict";

// Model

const model = {
    icons: {
        pawn: "♟",
        bishop: "♝",
        knight: "♞",
        rook: "♜",
        queen: "♛",
        king: "♚"
    },
    gameState: {
        joinPin: null,
        gameReady: null,
        gameId: null,
        playerId: null,
        playerColor: null,
        lastChange: null,
        turn: null,
        opponentName: null
    },
    piecesState: {
        pieces: [],
        selectedIndex: null,
        currentLegalMoves: [],
        latestOpponentMove: {
            from: [],
            to: []
        },
        transcript: []
    },
    errorMessages: {
        join: null,
    },
    currentView: "main-menu"
}

// View

const app = document.getElementById('app');
const chessBoard = document.getElementById('chess-board');
let currentView = "main-menu";

updateView();

function updateView() {

    if (currentView == "activeGame") {

        app.innerHTML = activeGameHTML();
        updatePiecesView();
        addEventListenersOnPieces();

    } else if (currentView == "waitingForPlayer") {

        app.innerHTML = waitingForPlayerHTML();

    } else {

        // Show main menu
        app.innerHTML = mainMenuHTML();
        
    }

}

function waitingForPlayerHTML() {

    return /*html*/`
        <div class="waiting-for-player">
            <h1>Waiting for player to join</h1>
            <p>Share this code with your opponent, so they can join the game.</p>
            <span>${model.gameState.joinPin}</span>
        </div>
    `;

}

function activeGameHTML() {

    let flipBoardClass = '';

    if (model.gameState.playerColor == "black") {
        flipBoardClass = " flip-board";
    }

    return /*html*/`
        <div class="chess-board-wrapper${flipBoardClass}">
            <h1 class="show-turn">${model.gameState.turn}'s turn</h1>
            ${boardViewHTML()}
            <div class="x-axis"><span>A</span><span>B</span><span>C</span><span>D</span><span>E</span><span>F</span><span>G</span><span>H</span></div>
            <div class="y-axis"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span></div>
            <div class="sidebar">
                ${disabledPiecesHTML("white")}
                ${disabledPiecesHTML("black")}
            </div>
        </div>
    `;

}

function mainMenuHTML() {

    return /*html*/`
        <div class="main-menu">
            <h1 class="title">Welcome to this crazy chess game!</h1>
            <div class="menu-card">
                <h2>New Online Game</h2>
                <p>When you create a new game, you will receive a code. Share this code with your opponent so they can join!</p>
                <button onclick="createNewGame()">Create new game</button>
            </div>
            <div class="menu-card">
                <h2>Join with code</h2>
                <p>
                    <input
                        type="number"
                        id="join-code"
                        placeholder="000000"
                        oninput="model.gameState.joinPin = this.value"
                    />
                </p>
                <p>${model.errorMessages.join || ''}</p>
                <button onclick="joinGame()">Join</button>
            </div>
            <!-- <div class="menu-card">
                <h2>Play offline</h2>
                <p>If you want to play against yourself, you can start an offline game here!</p>
                <button onclick="playOffline()">New offline game</button>
            </div> -->
            <div class="menu-card active-games">
                <h2>Your active games</h2>
                ${listActiveGamesHTML()}
            </div>
        </div>
    `;

}

function listActiveGamesHTML() {
    let savedRoundsJSON = localStorage.getItem("savedRounds");

    if (savedRoundsJSON == null) {
        return "<p>No saved games</p>"
    }

    let savedRounds = JSON.parse(savedRoundsJSON);

    let listHTML = '';

    for (let round of savedRounds) {
        listHTML += /* html */ `
            <div class="active-games-row">
                <div>${round.opponentName}</div>
                <div>${round.date}</div>
                <button onclick="removeFromLocalStorage('${round.gameId}', '${round.playerId}')" style="background-color: darkred">X</button>
                <button onclick="resumeFromLocalStorage('${round.gameId}', '${round.playerId}', '${round.playerColor}')">Continue</button>
            </div>
        `;
    }

    return /* html */`
        <div class="active-games-grid">
            <!-- <tr>
                <th></th>
                <th>Opponent</th>
                <th>Date started</th>
                <th></th>
            </tr> -->
            ${listHTML}
        </div>
    `;
}

function disabledPiecesHTML(color) {

    if (!getDisabledPiecesIndex(color)) {
        return;
    }

    let disabledPiecesIndex = getDisabledPiecesIndex(color);
    let pieceClass = `${color}-piece`;

    let html = /*html*/`
        <div class="disabled-${color}">
    `;

    for (let i=0; i<disabledPiecesIndex.length; i++) {
        html += /*html*/`
            <div class="${pieceClass}" piece-index="${disabledPiecesIndex[i]}">
                ${model.icons[model.piecesState.pieces[disabledPiecesIndex[i]].type]}
            </div>
        `;
    }

    html += `</div>`;

    return html;

}

function boardViewHTML() {

    let boardHtml = '';

    boardHtml += /*html*/`<div id="chess-board">`;

    for (let rowCount = 8; rowCount >= 1; rowCount--) {
        let parity = (rowCount%2 == 0) ? 'even' : 'odd';
        boardHtml += boardRowView(parity, rowCount);
    }

    boardHtml += /*html*/`</div>`;

    return boardHtml;

}

function boardRowView(rowParity, rowCount) {

    let html = '';
    let CellParityOffest = 0;

    if (rowParity == 'odd') {
        CellParityOffest = 1;
    }

    for (let colCount = 1; colCount <= 8; colCount++) {
        let cellColor = ( (colCount+CellParityOffest) % 2 == 0 ) ? 'black' : 'white';

        if (model.piecesState.currentLegalMoves && model.piecesState.currentLegalMoves.some(position => position.x == colCount && position.y == rowCount)) {
            html += /*html*/`
            <div class="cell cell-legal-move" row="${rowCount}" col="${colCount}"></div>
            `;
        } else {
            html += /*html*/`
            <div class="cell cell-${cellColor}" row="${rowCount}" col="${colCount}"></div>
            `;
        }
    }

    return html;

}

function updatePiecesView() {

    let activePieceClass = '';

    for (let i=0; i<model.piecesState.pieces.length; i++) {

        if (!model.piecesState.pieces[i].disabled) {
            let piece = model.piecesState.pieces[i];
            let icon = model.icons[piece.type];
            let targetCell = app.querySelector(`.cell[row="${piece.position.y}"][col="${piece.position.x}"]`);
            targetCell.innerHTML = icon;
            targetCell.classList.add(`${piece.color}-piece`);
            targetCell.setAttribute("piece-index", i);
            
            if (i === model.piecesState.selectedIndex) {
                targetCell.classList.add("selected-piece");
            }
        }

    }

}


// Controller

let serverPullInterval = setInterval( () => {
    
    if (!model.gameState.gameId) return;

    if (!model.gameState.gameReady) {
        console.log("Pulling server: Game is not ready!");
        getState(true);
        return;
    } 
    
    if (model.gameState.gameReady && model.gameState.turn == model.gameState.playerColor && currentView == "activeGame") {
        console.log("Waiting for player to move");
        return;
    }

    if (model.gameState.gameReady) {
        console.log("Pulling server: Game is ready, syncing.");
        getState(false);
        if (currentView != "activeGame") {
            currentView = "activeGame";
            updateView();
        }
    }
    
}, 1000);

async function createNewGame() {

    const response = await fetch("/createNewGame", {
    method: 'POST',
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
    }
    });

    response.json().then(data => {
        console.log(data);
        // Update local variables
        model.gameState.gameId = data.gameId;
        model.gameState.playerId = data.playerId;
        model.gameState.playerColor = data.playerColor;
        model.gameState.joinPin = data.joinPin;
        model.gameState.lastChange = data.lastChange;
        model.gameState.turn = data.turn;
        model.piecesState.pieces = data.piecesState;

        setLocalStorage();

        // Change current view to "Waiting for player"
        currentView = "waitingForPlayer";
        updateView();
    });

}

async function joinGame() {

    const payload = {
        joinPin: model.gameState.joinPin
    }

    const response = await fetch("/joinGame", {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    response.json().then(async data => {
        console.log(data);
        if (data.error) {
            model.errorMessages.join = data.error;
            updateView();
            return;
        }
        model.gameState.gameId = data.gameId;
        model.gameState.playerId = data.playerId;
        model.gameState.playerColor = data.playerColor; // Set playerColor = black for 2nd player.

        setLocalStorage();

        getState(false);
    });

}

function resumeFromLocalStorage(gameId, playerId, playerColor) {

    model.gameState.gameId = gameId;
    model.gameState.playerId = playerId;
    model.gameState.playerColor = playerColor;

    getState(false);

}

async function getState(checkGameReady) {

    const payload = {
        gameId: model.gameState.gameId,
        playerId: model.gameState.playerId,
        lastChange: model.gameState.lastChange,
        checkGameReady
    }

    const response = await fetch("/getstate", {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    response.json().then(data => {
        console.log(data);
        if (checkGameReady) {
            model.gameState.gameReady = data.gameReady;
            return;
        }
        if (!data.hasChanged) return;
        model.gameState.turn = data.turn;
        model.gameState.lastChange = data.lastChange;
        model.piecesState.pieces = JSON.parse(data.piecesState);
        currentView = "activeGame";
        updateView();
    });

}

async function moveToCell(targetPosition) {

    const payload = {
        gameId: model.gameState.gameId,
        playerId: model.gameState.playerId,
        selectedPieceIndex: model.piecesState.selectedIndex,
        targetPosition: targetPosition
    };

    const response = await fetch("/movepiece", {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    response.json().then(data => {
        console.log(data);
        model.piecesState.selectedIndex = null;
        model.piecesState.currentLegalMoves = null;
        getState(false);
    });

}

async function getLegalMoves(index) {

    const payload = {
        gameId: model.gameState.gameId,
        selectedPieceIndex: index
    }

    const response = await fetch("/getmoves", {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    response.json().then(async data => {
        console.log(data);
        if (data.error) { alert(data.error); return; }
        model.piecesState.currentLegalMoves = data;
        updateView();
    });
    
}

function selectPiece(index) {

    // If empty cell or enemy piece, reset variables and update view
    if ( !index && index !== 0 || model.piecesState.pieces[index].color !== model.gameState.turn ) {
        model.piecesState.selectedIndex = null;
        model.piecesState.currentLegalMoves = [];
        updateView();
        return;
    }

    model.piecesState.selectedIndex = index;
    getLegalMoves(index);

}

function getDisabledPiecesIndex(color) {

    let disabledPieces = [];

    for (let i = 0; i < model.piecesState.pieces.length; i++) {
        
        if (model.piecesState.pieces[i].disabled && model.piecesState.pieces[i].color == color) {
            disabledPieces.push(i);
        }

    }

    return disabledPieces;

}

function setLocalStorage() {
    let savedRoundsJSON = localStorage.getItem("savedRounds");
    const addToSavedRounds = {
        gameId: model.gameState.gameId,
        playerId: model.gameState.playerId,
        playerColor: model.gameState.playerColor,
        opponentName: model.gameState.opponentName,
        date: new Date().toLocaleString()
    };

    let savedRounds = JSON.parse(savedRoundsJSON);
    if (savedRounds) {
        savedRounds.unshift(addToSavedRounds);
    } else {
        savedRounds = [addToSavedRounds];
    }

    savedRoundsJSON = JSON.stringify(savedRounds);
    localStorage.setItem("savedRounds", savedRoundsJSON);
}

function removeFromLocalStorage(gameIdToRemove, playerId) {
    let savedRoundsJSON = localStorage.getItem("savedRounds");
    let savedRounds = JSON.parse(savedRoundsJSON);
    let roundIndexToRemove = null;

    for (let i=0; i < savedRounds.length; i++) {
        let round = savedRounds[i];
        if (round.gameId == gameIdToRemove && round.playerId == playerId) {
            roundIndexToRemove = i;
            break;
        }
    }

    if (roundIndexToRemove === null) return;
    
    console.log("roundIndexToRemove: " + roundIndexToRemove);
    savedRounds.splice(roundIndexToRemove, 1);

    if (savedRounds.length) {
        savedRoundsJSON = JSON.stringify(savedRounds);
        localStorage.setItem("savedRounds", savedRoundsJSON);
    } else {
        localStorage.removeItem("savedRounds");
    }
    
    updateView();
}

function addEventListenersOnPieces() {

    if (model.gameState.turn !== model.gameState.playerColor) return;

    document.querySelectorAll('.cell:not(.cell-legal-move)').forEach(cell => {

        cell.addEventListener("mousedown", function (event) {
            let index = parseInt(this.getAttribute("piece-index"));
            selectPiece(index);
            // If empty cell, reset variables and update view
        });

    });

    document.querySelectorAll('.cell-legal-move').forEach(cell => {

        cell.addEventListener("mouseup", function (event) {
            let targetPosition = {x: parseInt(this.getAttribute("col")), y: parseInt(this.getAttribute("row"))};
            moveToCell(targetPosition);
        });

    });

}