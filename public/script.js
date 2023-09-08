// Model

const icons = {
    pawn: "♟",
    bishop: "♝",
    knight: "♞",
    rook: "♜",
    queen: "♛",
    king: "♚"
    
}
let gameIsReady = false;
let piecesState = [];
let boardSpecialState = {
    check: {
        team: null,
        attackId: null,
        targetId: null
    }
}
let selectedPieceIndex;
let currentLegalMoves;
let currentTeam;
let serverPullInterval;// = setInterval(getstate(), 1000);
let joinError = null;

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

    } else {
        // Show main menu
        app.innerHTML = mainMenuHTML();
    }
}

function activeGameHTML() {
    return /*html*/`
        <div class="chess-board-wrapper">
            <h1 class="show-turn">${currentTeam}'s turn</h1>
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
                <button onclick="newgame()">Create new game</button>
            </div>
            <div class="menu-card">
                <h2>Join with code</h2>
                <p><input type="number" id="join-code" placeholder="000000" /></p>
                <button onclick="joinGame()">Join</button>
                <p>${joinError || ''}</p>
            </div>
            <div class="menu-card">
                <h2>Play offline</h2>
                <p>If you want to play against yourself, you can start an offline game here!</p>
                <button onclick="playOffline()">Join</button>
            </div>
            <div class="menu-card">
                <h2>Your active games</h2>
                <p>Jump back into one of your games:</p>
            </div>
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
                ${icons[piecesState[disabledPiecesIndex[i]].type]}
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

        if (currentLegalMoves && currentLegalMoves.some(position => position.x == colCount && position.y == rowCount)) {
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

    for (let i=0; i<piecesState.length; i++) {
        if (!piecesState[i].disabled) {
            let piece = piecesState[i];
            let icon = icons[piece.type];
            let targetCell = app.querySelector(`.cell[row="${piece.position.y}"][col="${piece.position.x}"]`);
            targetCell.innerHTML = icon;
            targetCell.classList.add(`${piece.color}-piece`);
            targetCell.setAttribute("piece-index", i);
            
            if (i === selectedPieceIndex) {
                targetCell.classList.add("selected-piece");
            }
        }
    }
}


// Controller

function createNewGame() {

}

function joinGame() {

}

function getState() {

}

function updateState() {

}

function getLegalMoves() {
    
}

function updateModel() {
    /* 
        request = {
            gameId,
            playerId,
            lastChange // Timestamp på siste sync
            checkGameReady: true | false
        }
    */
}

function selectPiece(index) {
    // If empty cell or enemy piece, reset variables and update view
    if ( !index && index !== 0 || piecesState[index].color !== currentTeam ) {
        selectedPieceIndex = '';
        currentLegalMoves = [];
        updateView();
        return;
    }

    selectedPieceIndex = index;
    getLegalMoves();
    updateView();
}

function addEventListenersOnPieces() {
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