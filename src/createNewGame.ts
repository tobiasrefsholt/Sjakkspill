import database from './database';
import numberGen from './numberGenerator';
import {turn} from "./types";

export function createNewGame() {

    const gameId = numberGen.generateId();
    const joinPin = numberGen.generatePin();
    const firstPlayerId = numberGen.generateId();
    const timestamp = new Date().getTime();

    database.newGameEntry(gameId, joinPin, firstPlayerId);
    database.newPlayerEntry(firstPlayerId, gameId, "white");
    database.updateState(gameId, {
        piecesState: JSON.stringify(getInitialPiecesState()), turn: "white", timestamp
    })

    return {
        gameId,
        joinPin,
        playerId: firstPlayerId,
        playerColor: "white",
        turn: "white",
        lastChange: timestamp,
        piecesState: getInitialPiecesState(),
    };
}

function getInitialPiecesState() {

    // @ts-ignore
    let piecesState = getInitialPawnPositions("white").concat(getInitialPawnPositions("black"));

    // Bishops
    piecesState.push({
        position: {
            x: 3, y: 1
        }, type: "bishop", color: "white", firstMove: true,
    })
    piecesState.push({
        position: {
            x: 6, y: 1
        }, type: "bishop", color: "white", firstMove: true,
    })
    piecesState.push({
        position: {
            x: 3, y: 8
        }, type: "bishop", color: "black", firstMove: true,
    })
    piecesState.push({
        position: {
            x: 6, y: 8
        }, type: "bishop", color: "black", firstMove: true,
    })

    // Knights
    piecesState.push({
        position: {
            x: 2, y: 1
        }, type: "knight", color: "white", firstMove: true,
    })
    piecesState.push({
        position: {
            x: 7, y: 1
        }, type: "knight", color: "white", firstMove: true,
    })
    piecesState.push({
        position: {
            x: 2, y: 8
        }, type: "knight", color: "black", firstMove: true,
    })
    piecesState.push({
        position: {
            x: 7, y: 8
        }, type: "knight", color: "black", firstMove: true,
    })

    // Rooks
    piecesState.push({
        position: {
            x: 1, y: 1
        }, type: "rook", color: "white", firstMove: true,
    })
    piecesState.push({
        position: {
            x: 8, y: 1
        }, type: "rook", color: "white", firstMove: true,
    })
    piecesState.push({
        position: {
            x: 1, y: 8
        }, type: "rook", color: "black", firstMove: true,
    })
    piecesState.push({
        position: {
            x: 8, y: 8
        }, type: "rook", color: "black", firstMove: true,
    })

    // Queens
    piecesState.push({
        position: {
            x: 4, y: 1
        }, type: "queen", color: "white", firstMove: true,
    })
    piecesState.push({
        position: {
            x: 4, y: 8
        }, type: "queen", color: "black", firstMove: true,
    })

    // Kings
    piecesState.push({
        position: {
            x: 5, y: 1
        }, type: "king", color: "white", firstMove: true,
    })
    piecesState.push({
        position: {
            x: 5, y: 8
        }, type: "king", color: "black", firstMove: true,
    })

    return piecesState;

}

class piece {
}

function getInitialPawnPositions(color: turn) {

    const pawns : piece[] = [];
    let targetRow;

    if (color === "white") {
        targetRow = 2;
    } else if (color === "black") {
        targetRow = 7;
    } else {
        return;
    }

    for (let colCount = 1; colCount <= 8; colCount++) {
        pawns.push({
            position: {
                x: colCount, y: targetRow
            }, type: "pawn", color: color, firstMove: true,
        })
    }

    return pawns;
}