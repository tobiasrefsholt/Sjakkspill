import database from './database';
import getMoves from './getMoves';
import {piece, coordinate, turn} from "./types";

type request = {
    gameId: string,
    playerId: string,
    selectedPieceIndex: number,
    targetPosition: coordinate
}

async function movePiece(request: request) {

    // Handle errors
    const requestError = requestHasError(request);
    if (requestError !== null) return {error: requestError};

    const {gameId, playerId, selectedPieceIndex, targetPosition} = request;

    // Get state from database
    const {pieces_state: piecesStateAsJSON, turn} = await database.getCurrentState(gameId);
    const piecesState: piece[] = JSON.parse(piecesStateAsJSON);
    const selectedPiece = piecesState[selectedPieceIndex];

    // Return error of user cannot move
    const canMove = await playerCanMove(playerId, gameId, turn);
    if (!canMove) return {error: "Not your turn"}

    await doMove(gameId, turn, piecesState, selectedPiece, targetPosition);

    return true;
}

function requestHasError(request: request) {
    if (!request.gameId) return "Ingen gameId definert, eller ugyldig format";
    if (!request.playerId) return "Ingen playerId definert, eller ugyldig format";
    if (!Number.isInteger(request.selectedPieceIndex)) return "selectedPieceIndex er ikke definert";
    if (!request.targetPosition) return "targetPosition er ikke definert";
    return null;
}

async function doMove(gameId: string, turn: turn, piecesState: piece[], selectedPiece: piece, targetPosition: coordinate) {
    // If there is a piece at the target field, disable it.
    const targetPieceIndex = getMoves.getPieceIndexByPosition(targetPosition, piecesState);
    if (targetPieceIndex !== null) {
        const targetPiece = piecesState[targetPieceIndex];
        targetPiece.disabled = true;
    }

    // Change coordinates of the selected piece
    selectedPiece.position.x = targetPosition.x;
    selectedPiece.position.y = targetPosition.y;
    selectedPiece.firstMove = false;

    // Update database
    await database.updateState(gameId, {
        piecesState: JSON.stringify(piecesState),
        lastMove: getLatestMoveAsJson(turn, selectedPiece, targetPosition),
        timestamp: new Date().getTime(),
        turn: swapTurn(turn)
    });
}

async function playerCanMove(playerId: string, gameId: string, turn: turn) {
    const currentPlayerColor = await database.getPlayerColor(playerId, gameId);
    return (turn === currentPlayerColor);
}

function getLatestMoveAsJson(turn: turn, selectedPiece: piece, targetPosition: coordinate) {
    const lastMove = {
        color: turn, from: {...selectedPiece.position}, to: targetPosition,
    }
    return (lastMove.from && lastMove.to) ? JSON.stringify(lastMove) : null;
}

function swapTurn(turn: turn): turn {
    return (turn === "white") ? "black" : "white";
}

module.exports = {movePiece};