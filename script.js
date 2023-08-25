// Model

const app = document.getElementById('app');
const chessBoard = document.getElementById('chess-board');
const icons = {
    pawn: "♟",
    bishop: "♝",
    knight: "♞",
    rook: "♜",
    queen: "♛",
    king: "♚"

}
let piecesState = [];
let selectedPieceIndex;
let currentLegalMoves;
let currentTeam = "white";

// View

init();

function init() {
    // Generer modellen (plasser brikkene i piecesState)
    resetPieces();
    // Vis modellen
    updateView();
}


function updateView() {
    app.innerHTML = /*html*/ `
        <div class="chess-board-wrapper">
            <h1 class="show-turn">${currentTeam}'s turn</h1>
            ${boardView()}
            <div class="x-axis"><span>A</span><span>B</span><span>C</span><span>D</span><span>E</span><span>F</span><span>G</span><span>H</span></div>
            <div class="y-axis"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span></div>
            <div class="sidebar">
                ${disabledPiecesHTML("white")}
                ${disabledPiecesHTML("black")}
            </div>
        </div>
    `
    updatePiecesView();
    addEventListenersOnPieces();
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

function boardView() {
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
function resetPieces() {
    piecesState = [];

    resetPawns("white");
    resetPawns("black");

    // Bishops
    piecesState.push({
        position: {
            x: 3,
            y: 1
        },
        type: "bishop",
        color: "white"
    })
    piecesState.push({
        position: {
            x: 6,
            y: 1
        },
        type: "bishop",
        color: "white"
    })
    piecesState.push({
        position: {
            x: 3,
            y: 8
        },
        type: "bishop",
        color: "black"
    })
    piecesState.push({
        position: {
            x: 6,
            y: 8
        },
        type: "bishop",
        color: "black"
    })

    // Knights
    piecesState.push({
        position: {
            x: 2,
            y: 1
        },
        type: "knight",
        color: "white"
    })
    piecesState.push({
        position: {
            x: 7,
            y: 1
        },
        type: "knight",
        color: "white"
    })
    piecesState.push({
        position: {
            x: 2,
            y: 8
        },
        type: "knight",
        color: "black"
    })
    piecesState.push({
        position: {
            x: 7,
            y: 8
        },
        type: "knight",
        color: "black"
    })

    // Rooks
    piecesState.push({
        position: {
            x: 1,
            y: 1
        },
        type: "rook",
        color: "white"
    })
    piecesState.push({
        position: {
            x: 8,
            y: 1
        },
        type: "rook",
        color: "white"
    })
    piecesState.push({
        position: {
            x: 1,
            y: 8
        },
        type: "rook",
        color: "black"
    })
    piecesState.push({
        position: {
            x: 8,
            y: 8
        },
        type: "rook",
        color: "black"
    })

    // Queens
    piecesState.push({
        position: {
            x: 4,
            y: 1
        },
        type: "queen",
        color: "white"
    })
    piecesState.push({
        position: {
            x: 4,
            y: 8
        },
        type: "queen",
        color: "black"
    })

    // Kings
    piecesState.push({
        position: {
            x: 5,
            y: 1
        },
        type: "king",
        color: "white"
    })
    piecesState.push({
        position: {
            x: 5,
            y: 8
        },
        type: "king",
        color: "black"
    })

}

function resetPawns(color) {
    let targetRow;
    
    if (color == "white") {
        targetRow = 2;
    } else if (color == "black") {
        targetRow = 7;
    } else {
        return;
    }

    for (let colCount = 1; colCount <= 8; colCount++) {
        piecesState.push({
            position: {
                x: colCount,
                y: targetRow
            },
            type: "pawn",
            color: color,
            firstMove: true,
        })
    }
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
    calculateLegalMoves();
    updateView();
}

function calculateLegalMoves() {
    pieceType = piecesState[selectedPieceIndex].type;
    let moves;
    currentLegalMoves = [];

    if (pieceType == "pawn") {
        moves = calculateLegalMovesPawn(piecesState[selectedPieceIndex]);
    } else if (pieceType == "bishop") {
        moves = calculateLegalMovesBishop(piecesState[selectedPieceIndex]);
    } else if (pieceType == "knight") {
        moves = calculateLegalMovesKnight(piecesState[selectedPieceIndex]);
    } else if (pieceType == "rook") {
        moves = calculateLegalMovesRook(piecesState[selectedPieceIndex]);
    } else if (pieceType == "queen") {
        moves = calculateLegalMovesQueen(piecesState[selectedPieceIndex]);
    } else if (pieceType == "king") {
        moves = calculateLegalMovesKing(piecesState[selectedPieceIndex]);
    }

    // Remove fields outside board
    for (let i=0; i<moves.length; i++) {
        if ((moves[i].x <= 8) && (moves[i].x >= 0) && (moves[i].y <= 8) && (moves[i].y >= 0)) {
            currentLegalMoves.push(moves[i]);
        }
    }

    console.log(currentLegalMoves);
}

function calculateLegalMovesPawn(currentPawn) {

    let legalMoves = [];
    // Definer hvilke regler som gjelder
    let currentRange = currentPawn.firstMove ? [1,2] : [1];

    // Definer offsetModifier som 1 eller -1, avhengig av fargen på brikken. Brukes for å snu om på lovlige trekk for svarte brikker.
    let offsetModifier;
    if (piecesState[selectedPieceIndex].color == "white") {
        offsetModifier = 1;
    } else {
        offsetModifier = -1;
    }

    // Sjekk om bonden har noen å angripe (diagonalt)
    let attackRange = [
        {x: currentPawn.position.x + 1 * offsetModifier, y: currentPawn.position.y + 1 * offsetModifier },
        {x: currentPawn.position.x + -1 * offsetModifier, y: currentPawn.position.y + 1 * offsetModifier }
    ]
    if ( currentPieceCanAttack(attackRange[0]) ) {
        legalMoves.push(attackRange[0])
    }
    if ( currentPieceCanAttack(attackRange[1]) ) {
        legalMoves.push(attackRange[1])
    }

    // Kalkuler lovlige felter etter reglene
    for (let i=0; i<currentRange.length; i++) {
        let targetCell = {
            x: currentPawn.position.x,
            y: currentPawn.position.y + currentRange[i] * offsetModifier
        };
        if (!getPieceIndexByPosition(targetCell)) {
            legalMoves.push(targetCell);
        }
    }

    return legalMoves;
    
}

function calculateLegalMovesBishop(currentBishop) {

    let legalMoves = calculateFieldsDiagonals(currentBishop);

    return legalMoves;

}

function calculateLegalMovesKnight(currentKnight) {

    let legalMoves = [];
    let possibleMoves = [
        { x: currentKnight.position.x + 2, y: currentKnight.position.y + 1 },
        { x: currentKnight.position.x + 1, y: currentKnight.position.y + 2 },
        { x: currentKnight.position.x - 1, y: currentKnight.position.y + 2 },
        { x: currentKnight.position.x - 2, y: currentKnight.position.y + 1 },
        { x: currentKnight.position.x - 2, y: currentKnight.position.y - 1 },
        { x: currentKnight.position.x - 1, y: currentKnight.position.y - 2 },
        { x: currentKnight.position.x + 1, y: currentKnight.position.y - 2 },
        { x: currentKnight.position.x + 2, y: currentKnight.position.y - 1 },
    ];

    for (let i=0; i<possibleMoves.length; i++) {

        if (fieldIsOccupied(possibleMoves[i]) != currentKnight.color) {
            legalMoves.push(possibleMoves[i]);
        }

    }

    return legalMoves;
}

function calculateLegalMovesRook(currentRook) {

    let northSouth = calculateFieldsNorthSouth(currentRook);
    let eastWest = calculateFieldsEastWest(currentRook);
    let legalMoves = northSouth.concat(eastWest);

    return legalMoves;

}

function calculateLegalMovesQueen(currentQueen) {

    let northSouth = calculateFieldsNorthSouth(currentQueen);
    let eastWest = calculateFieldsEastWest(currentQueen);
    let diagonals = calculateFieldsDiagonals(currentQueen);
    let legalMoves = northSouth.concat(eastWest, diagonals);

    return legalMoves;
}

function calculateLegalMovesKing(currentKing) {

    let legalMoves = [];
    let possibleMoves = [
        { x: currentKing.position.x, y: currentKing.position.y + 1 },
        { x: currentKing.position.x + 1, y: currentKing.position.y + 1 },
        { x: currentKing.position.x + 1, y: currentKing.position.y},
        { x: currentKing.position.x + 1, y: currentKing.position.y - 1 },
        { x: currentKing.position.x, y: currentKing.position.y - 1},
        { x: currentKing.position.x - 1, y: currentKing.position.y - 1 },
        { x: currentKing.position.x - 1, y: currentKing.position.y },
        { x: currentKing.position.x - 1, y: currentKing.position.y + 1 },
    ];

    for (let i=0; i<possibleMoves.length; i++) {

        if (fieldIsOccupied(possibleMoves[i]) != currentKing.color) {
            legalMoves.push(possibleMoves[i]);
        }

    }

    return legalMoves;
    
}

function calculateFieldsDiagonals(piece) {

    let legalMoves = [];

    // North-east
    for (let i=1; i<=7; i++) {    
        let targetCell = {};
        targetCell.x = piece.position.x + i;
        targetCell.y = piece.position.y + i;
        if (fieldIsOccupied(targetCell) == piece.color) {
            break;
        }
        legalMoves.push(targetCell);
        if (fieldIsOccupied(targetCell)) {
            break;
        }
    }

    // South-east
    for (let i=1; i<=7; i++) {
        let targetCell = {};
        targetCell.x = piece.position.x + i;
        targetCell.y = piece.position.y - i;
        if (fieldIsOccupied(targetCell) == piece.color) {
            break;
        }
        legalMoves.push(targetCell);
        if (fieldIsOccupied(targetCell)) {
            break;
        }
    }

    // South-west
    for (let i=1; i<=7; i++) {
        let targetCell = {};
        targetCell.x = piece.position.x - i;
        targetCell.y = piece.position.y - i;
        if (fieldIsOccupied(targetCell) == piece.color) {
            break;
        }
        legalMoves.push(targetCell);
        if (fieldIsOccupied(targetCell)) {
            break;
        }
    }

    // North-west
    for (let i=1; i<=7; i++) {
        let targetCell = {};
        targetCell.x = piece.position.x - i;
        targetCell.y = piece.position.y + i;
        if (fieldIsOccupied(targetCell) == piece.color) {
            break;
        }
        legalMoves.push(targetCell);
        if (fieldIsOccupied(targetCell)) {
            break;
        }
    }

    return legalMoves;

}

function calculateFieldsNorthSouth(piece) {

    let legalMoves = [];

    // North
    for (let i=1; i<=7; i++) {
        let targetCell = {};
        targetCell.x = piece.position.x;
        targetCell.y = piece.position.y + i;
        if (fieldIsOccupied(targetCell) == piece.color) {
            break;
        }
        legalMoves.push(targetCell);
        if (fieldIsOccupied(targetCell)) {
            break;
        }
    }

    // South
    for (let i=1; i<=7; i++) {
        let targetCell = {};
        targetCell.x = piece.position.x;
        targetCell.y = piece.position.y - i;
        if (fieldIsOccupied(targetCell) == piece.color) {
            break;
        }
        legalMoves.push(targetCell);
        if (fieldIsOccupied(targetCell)) {
            break;
        }
    }

    return legalMoves;

}

function calculateFieldsEastWest(piece) {

    let legalMoves = [];

    // East
    for (let i=1; i<=7; i++) {
        let targetCell = {};
        targetCell.x = piece.position.x + i;
        targetCell.y = piece.position.y;
        if (fieldIsOccupied(targetCell) == piece.color) {
            break;
        }
        legalMoves.push(targetCell);
        if (fieldIsOccupied(targetCell)) {
            break;
        }
    }

    // West
    for (let i=1; i<=7; i++) {
        let targetCell = {};
        targetCell.x = piece.position.x - i;
        targetCell.y = piece.position.y;
        if (fieldIsOccupied(targetCell) == piece.color) {
            break;
        }
        legalMoves.push(targetCell);
        if (fieldIsOccupied(targetCell)) {
            break;
        }
    }

    return legalMoves;

}

// Returns false if field is occupied, and piece color if occupied

function fieldIsOccupied(targetCell) {

    let targetPiece = getPieceIndexByPosition(targetCell)
    
    if (!targetPiece && targetPiece !== 0) {
        return false;
    }

    return piecesState[targetPiece].color;

}

function currentPieceCanAttack(target) {

    if (!piecesState[getPieceIndexByPosition(target)]) {
        return false;
    }

    let currentPiece = piecesState[selectedPieceIndex];
    let targetPiece = piecesState[getPieceIndexByPosition(target)];

    if (targetPiece.color == currentPiece.color) {
        return false;
    }

    return true;
}

function getPieceIndexByPosition(position) {

    for (let i = 0; i < piecesState.length; i++) {
        
        if (!piecesState[i].disabled && JSON.stringify(piecesState[i].position) == JSON.stringify(position)) {
            return i;
        }

    }

    return false;

}

function getDisabledPiecesIndex(color) {
    let disabledPieces = [];

    for (let i = 0; i < piecesState.length; i++) {
        
        if (piecesState[i].disabled && piecesState[i].color == color) {
            disabledPieces.push(i);
        }

    }

    return disabledPieces;
}

function moveToCell(targetPosition) {
    console.log(`Moving ${piecesState[selectedPieceIndex].color} ${piecesState[selectedPieceIndex].type} at x:${piecesState[selectedPieceIndex].position.x}, y:${piecesState[selectedPieceIndex].position.y} to x: ${targetPosition.x}, y: ${targetPosition.y}`);

    let targetPositionIndex;

    if (targetPositionIndex = getPieceIndexByPosition(targetPosition)) {
        piecesState[targetPositionIndex].disabled = true;
    }
    console.log("Piece to remove: " + targetPositionIndex);

    piecesState[selectedPieceIndex].position.x = targetPosition.x;
    piecesState[selectedPieceIndex].position.y = targetPosition.y;

    piecesState[selectedPieceIndex].firstMove = false;

    selectedPieceIndex = false;
    currentLegalMoves = false;
    (currentTeam == "white") ? currentTeam = "black" : currentTeam = "white";
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