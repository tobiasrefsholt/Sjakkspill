const database = require('./database');
const getState = require('./getState');
const getMoves = require('./getMoves');

async function movePiece(request) {

    if (!request.gameId) return { error: "Ingen gameId definert, eller ugyldig format" };
    if (!request.playerId) return { error: "Ingen playerId definert, eller ugyldig format" };
    if (!request.selectedPieceIndex) return { error: "selectedPieceIndex er ikke definert" };
    if (!request.targetPosition) return { error: "targetPosition er ikke definert" };

    const { gameId, playerId, selectedPieceIndex, targetPosition } = request;
    const { piecesState, turn } = await database.getCurrentState(gameId);
    const canMove = await playerCanMove(playerId, turn);

    /* if (!canMove) return { error: "Not your turn" } */

    let targetPositionIndex;

    if (targetPositionIndex = getMoves.getPieceIndexByPosition(targetPosition)) {
        piecesState[targetPositionIndex].disabled = true;
    }

    console.log("Piece to remove: " + targetPositionIndex);

    piecesState[selectedPieceIndex].position.x = targetPosition.x;
    piecesState[selectedPieceIndex].position.y = targetPosition.y;
    piecesState[selectedPieceIndex].firstMove = false;

    const timestamp = new Date().getTime();

    turn = ( turn == "white" ) ? "black" : "white";

    database.updateState({
        pieces_state: piecesState,
        turn,
        latest_update: timestamp
    });

    return `Moving ${piecesState[selectedPieceIndex].color} ${piecesState[selectedPieceIndex].type} at x:${piecesState[selectedPieceIndex].position.x}, y:${piecesState[selectedPieceIndex].position.y} to x: ${targetPosition.x}, y: ${targetPosition.y}`;

}

async function playerCanMove(playerId, gameId, turn) {

    let currentPlayerColor = await database.getPlayerColor(playerId, gameId);

    return (currentPlayerColor == turn) ? currentPlayerColor : false;

}

module.exports = { movePiece };