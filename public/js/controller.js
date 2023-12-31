"use strict";

setInterval( () => {
    
    if (!model.gameState.gameId) return;

    if (!model.gameState.gameReady) {
        /* console.log("Pulling server: Game is not ready!"); */
        getState(true);
        return;
    } 
    
    if (model.gameState.gameReady && model.gameState.turn === model.gameState.playerColor && model.app.currentView === "activeGame") {
        /* console.log("Waiting for player to move"); */
        return;
    }

    if (model.gameState.gameReady) {
        /* console.log("Pulling server: Game is ready, syncing."); */
        getState(false);
        if (model.app.currentView !== "activeGame" && model.app.currentView !== "setOpponentName") {
            model.app.currentView = "activeGame";
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

        // Change current view to "Waiting for player"
        model.app.currentView = "setOpponentName";
        updateView();
    });

}

function setOpponentName() {
    model.gameState.opponentName = model.fields.gameName;
    setLocalStorage();

    if (model.gameState.gameReady) {
        model.app.currentView = "activeGame";
    } else {
        model.app.currentView = "waitingForPlayer";
    }
    updateView();
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
        model.app.currentView = "setOpponentName";
        updateView();
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
        /* console.log(data); */
        if (checkGameReady) {
            model.gameState.gameReady = data.gameReady;
            return;
        }
        if (!data.hasChanged) return;
        model.gameState.turn = data.turn;
        model.gameState.lastChange = data.lastChange;
        model.piecesState.pieces = JSON.parse(data.piecesState);
        if (data.lastMove) model.gameState.lastMove = JSON.parse(data.lastMove);
        if (model.app.currentView === "activeGame") {
            updateView();
        }
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
        
        if (model.piecesState.pieces[i].disabled && model.piecesState.pieces[i].color === color) {
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
        if (round.gameId === gameIdToRemove && round.playerId === playerId) {
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

        cell.addEventListener("mousedown", function () {
            let index = parseInt(this.getAttribute("piece-index"));
            selectPiece(index);
            // If empty cell, reset variables and update view
        });

    });

    document.querySelectorAll('.cell-legal-move').forEach(cell => {

        cell.addEventListener("mouseup", function () {
            let targetPosition = {x: parseInt(this.getAttribute("col")), y: parseInt(this.getAttribute("row"))};
            moveToCell(targetPosition);
        });

    });

}