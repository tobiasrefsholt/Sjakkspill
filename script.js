// Model

const app = document.getElementById('app');
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
let piecesPosition = {
    a2: {
        piece: {
            type: "pawn",
            color: "white",
            fistMove: true,
        }
    }
}

// View

updateView()

function updateView() {
    app.innerHTML = /*html*/ `
        <div class="chess-board-wrapper">
            ${drawBoard()}
            <div class="x-axis"><span>A</span><span>B</span><span>C</span><span>D</span><span>E</span><span>F</span><span>G</span><span>H</span></div>
            <div class="y-axis"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span></div>
        </div>
    `
    placePieces();
}

function drawBoard() {
    let boardHtml = '';

    boardHtml += /*html*/`<div class="chess-board">`;

    for (let rowCount = 0; rowCount < 8; rowCount++) {
        let parity = (rowCount%2 == 0) ? 'even' : 'odd';
        boardHtml += drawBoardRow(parity, rowCount);
    }

    boardHtml += /*html*/`</div>`;

    return boardHtml;
}

function drawBoardRow(rowParity, rowCount) {
    let html = '';
    let CellParityOffest = 0;

    if (rowParity == 'even') {
        CellParityOffest = 1;
    }

    for (let colCount = 0; colCount < 8; colCount++) {
        let cellColor = ( (colCount+CellParityOffest) % 2 == 0 ) ? 'black' : 'white';

        html += /*html*/`
        <div class="cell cell-${cellColor}" row="${rowCount}" col="${colCount}"></div>
        `;
    }

    return html;
}

function placePieces() {

}


// Controller
