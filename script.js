// Model

const app = document.getElementById('app');
const chessBoard = document.getElementById('chess-board');
const movementRules = {
    pawn: {
        move: {
            north: [1],
        },
        firstMove: {
            north: [1,2],
        },
        attack: {
            northEast: [1],
            northWest: [1],
        },
    },
    bishop: {
        move: {
            northEast: [1,2,3,4,5,6,7],
            southEast: [1,2,3,4,5,6,7],
            southWest: [1,2,3,4,5,6,7],
            northWest: [1,2,3,4,5,6,7],
        },
    },
    knight: {
        possibleMoves: [
            {xOffest: 2, yOffset: 1},
            {xOffest: 1, yOffset: 2},
            {xOffest: -1, yOffset: 2},
            {xOffest: -2, yOffset: 1},
            {xOffest: -2, yOffset: -1},
            {xOffest: -1, yOffset: -2},
            {xOffest: 1, yOffset: -2},
            {xOffest: 2, yOffset: -1},
        ]
    },
    rook: {
        move: {
            north: [1,2,3,4,5,6,7],
            east: [1,2,3,4,5,6,7],
            south: [1,2,3,4,5,6,7],
            west: [1,2,3,4,5,6,7],
        },
    },
    queen: {
        move: {
            north: [1,2,3,4,5,6,7],
            northEast: [1,2,3,4,5,6,7],
            east: [1,2,3,4,5,6,7],
            southEast: [1,2,3,4,5,6,7],
            south: [1,2,3,4,5,6,7],
            southWest: [1,2,3,4,5,6,7],
            west: [1,2,3,4,5,6,7],
            northWest: [1,2,3,4,5,6,7],
        },
    },
    king: {
        move: {
            north: [1],
            northEast: [1],
            east: [1],
            southEast: [1],
            south: [1],
            southWest: [1],
            west: [1],
            northWest: [1],
        },
    }
}
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
            ${boardView()}
            <div class="x-axis"><span>A</span><span>B</span><span>C</span><span>D</span><span>E</span><span>F</span><span>G</span><span>H</span></div>
            <div class="y-axis"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span></div>
        </div>
    `
    updatePiecesView();
    addEventListenersOnPieces();
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
    if (!index && index !== 0) {
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
    currentLegalMoves = [];
    pieceType = piecesState[selectedPieceIndex].type;
    currentX = piecesState[selectedPieceIndex].position.x;
    currentY = piecesState[selectedPieceIndex].position.y;

    if (pieceType == "pawn") {
        currentLegalMoves = calculateLegalMovesPawn(piecesState[selectedPieceIndex])
    }
}

function calculateLegalMovesPawn(currentPawn) {

    let legalMoves = [];
    // Definer hvilke regler som gjelder
    let currentMoveRules = currentPawn.firstMove ? movementRules.pawn.firstMove : movementRules.pawn.move;

    // Sjekk om bonden har noen å angripe (diagonalt)
    let attackRange = [
        {x: currentPawn.position.x + 1, y: currentPawn.position.y + 1 },
        {x: currentPawn.position.x + -1, y: currentPawn.position.y + 1 }
    ]
    if (getPieceIndexByPosition(attackRange[0])) {
        legalMoves.push(attackRange[0])
    }
    if (getPieceIndexByPosition(attackRange[1])) {
        legalMoves.push(attackRange[1])
    }

    // Kalkuler lovlige felter etter reglene
    for (let i=0; i<currentMoveRules.north.length; i++) {
        legalMoves.push({
            x: currentPawn.position.x,
            y: currentPawn.position.y + currentMoveRules.north[i]
        });
    }

    console.log(legalMoves);

    return legalMoves;
    
}

function getPieceIndexByPosition(position) {

    for (let i = 0; i < piecesState.length; i++) {
        
        if (JSON.stringify(piecesState[i].position) == JSON.stringify(position)) {
            return i;
        }

    }

    return false;

}

function moveToCell(targetPosition) {
    console.log(`Moving ${piecesState[selectedPieceIndex].type} at x:${piecesState[selectedPieceIndex].position.x}, y:${piecesState[selectedPieceIndex].position.y} to x: ${targetPosition.x}, y: ${targetPosition.y}`)
}

function addEventListenersOnPieces() {
    document.querySelectorAll('.cell:not(.cell-legal-move)').forEach(cell => {

        cell.addEventListener("click", function (event) {
            let index = parseInt(this.getAttribute("piece-index"));
            selectPiece(index);
        });

    });

    document.querySelectorAll('.cell-legal-move').forEach(cell => {

        cell.addEventListener("click", function (event) {
            let targetPosition = {x: parseInt(this.getAttribute("col")), y: parseInt(this.getAttribute("row"))};
            moveToCell(targetPosition);
        });

    });
}