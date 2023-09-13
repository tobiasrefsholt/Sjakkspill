const database = require('./database');
const numberGen = require('./numberGenerator');

function createNewGame() {
    
    const gameId = numberGen.generateId();
    const joinPin = numberGen.generatePin();
    const firstPlayerId = numberGen.generateId();
    const timestamp = new Date().getTime();
    
    database.newGameEntry(gameId, joinPin, firstPlayerId);
    database.newPlayerEntry(firstPlayerId, gameId, "white");
    database.updateState(gameId, {
        piecesState: JSON.stringify(getInitialPiecesState()),
        turn: "white",
        timestamp
    })

    return {
        gameId,
        joinPin,
        playerId: firstPlayerId,
        turn: "white",
        lastChange: timestamp,
        piecesState: getInitialPiecesState(),
    };
}

function getInitialPiecesState() {

    let piecesState = getInitialPawnPositions("white").concat(getInitialPawnPositions("black"));

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

    return piecesState;

}

function getInitialPawnPositions(color) {

    const pawns = [];
    let targetRow;
    
    if (color == "white") {
        targetRow = 2;
    } else if (color == "black") {
        targetRow = 7;
    } else {
        return;
    }

    for (let colCount = 1; colCount <= 8; colCount++) {
        pawns.push({
            position: {
                x: colCount,
                y: targetRow
            },
            type: "pawn",
            color: color,
            firstMove: true,
        })
    }

    return pawns;
}

module.exports = { createNewGame };