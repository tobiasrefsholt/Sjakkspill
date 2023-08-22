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
    drawBoard();
    placePieces();
}

function drawBoard() {

}

function placePieces() {

}


// Controller
