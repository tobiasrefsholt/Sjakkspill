"use strict";

updateView();

function updateView() {

    const currentView = model.app.currentView;

    const app = document.getElementById('app');

    if (currentView === "activeGame") {

        app.innerHTML = activeGameHTML();
        updatePiecesView();
        addEventListenersOnPieces();
        return;

    }

    if (currentView === "setOpponentName") {

        app.innerHTML = /* html */`
            <h1>Set opponent name</h1>
            <div>
                <input type="text" id="opponent-name-input" onchange="model.fields.gameName = this.value">
                <p><button onclick="setOpponentName()">Continue</button></p>
            </div>
        `;
        return;
        
    }
    
    if (currentView === "waitingForPlayer") {

        app.innerHTML = waitingForPlayerHTML();
        return;

    }

    // Show main menu
    app.innerHTML = mainMenuHTML();

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

    if (model.gameState.playerColor === "black") {
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
            ${activeGamesCardHTML()}
        </div>
    `;

}

function activeGamesCardHTML() {
    let savedRoundsJSON = localStorage.getItem("savedRounds");

    if (savedRoundsJSON == null) return '';

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
        <div class="menu-card active-games">
            <h2>Your active games</h2>
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
        let parity = (rowCount%2 === 0) ? 'even' : 'odd';
        boardHtml += boardRowView(parity, rowCount);
    }

    boardHtml += /*html*/`</div>`;

    return boardHtml;

}

function boardRowView(rowParity, rowCount) {

    let html = '';
    let CellParityOffest = 0;

    if (rowParity === 'odd') {
        CellParityOffest = 1;
    }

    for (let colCount = 1; colCount <= 8; colCount++) {
        let cellColor = ( (colCount+CellParityOffest) % 2 === 0 ) ? 'black' : 'white';

        // Sjekk om denne cellen er et lovlig trekk. Hvis den er det, legg til cell-legal-move klassen.
        if (model.piecesState.currentLegalMoves && model.piecesState.currentLegalMoves.some(position => position.x === colCount && position.y === rowCount)) {
            html += /*html*/`
                <div class="cell cell-legal-move" row="${rowCount}" col="${colCount}"></div>
            `;
            continue;
        }
        
        // Sjekk om forrige trekk fra motstanderen ble gjort fra/til denne cellen og gi den en egen bakgrunnsfarge.
        if ( 
            (model.gameState.playerColor !== model.gameState.lastMove.color) 
            && ( (model.gameState.lastMove.from.x === colCount && model.gameState.lastMove.from.y === rowCount)
                || (model.gameState.lastMove.to.x === colCount && model.gameState.lastMove.to.y === rowCount)
            )
        ) {

            html += /*html*/`
                <div class="cell last-move" row="${rowCount}" col="${colCount}"></div>
            `;
            continue;
        }

        // Hvis ingen av if-setningene slår inn, sett standard farge.
        html += /*html*/`
            <div class="cell cell-${cellColor}" row="${rowCount}" col="${colCount}"></div>
        `;
    }

    return html;

}

function updatePiecesView() {

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