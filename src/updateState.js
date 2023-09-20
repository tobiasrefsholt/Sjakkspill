const database = require('./database');
/* const getState = require('./getState'); */
const getMoves = require('./getMoves');

async function movePiece(request) {

    if (!request.gameId) return { error: "Ingen gameId definert, eller ugyldig format" };
    if (!request.playerId) return { error: "Ingen playerId definert, eller ugyldig format" };
    if (!request.selectedPieceIndex) return { error: "selectedPieceIndex er ikke definert" };
    if (!request.targetPosition) return { error: "targetPosition er ikke definert" };

    console.log("request: " + request);
    console.log("JSON.stringify(request): " + JSON.stringify(request));

    const { gameId, playerId, selectedPieceIndex, targetPosition } = request;
    let { pieces_state: piecesStateAsJSON, turn } = await database.getCurrentState(gameId);
    let piecesState = JSON.parse(piecesStateAsJSON);
    const canMove = await playerCanMove(playerId, gameId, turn);

    console.log("player can move: " + canMove);

    if (!canMove) return { error: "Not your turn" }

    console.log("piecesState: " + piecesState);

    const lastMove = {
        color: turn,
        from: { ...piecesState[selectedPieceIndex].position },
        to: targetPosition,
    }

    const lastMoveJSON = (lastMove.from && lastMove.to) ? JSON.stringify(lastMove) : null;

    // If there is a piece at the target field, disable it.
    let targetPositionIndex = getMoves.getPieceIndexByPosition(targetPosition, piecesState);

    if (targetPositionIndex) {
        piecesState[targetPositionIndex].disabled = true;
        console.log("Piece to remove: " + targetPositionIndex);
    }

    // Change coordinates of the selected piece
    piecesState[selectedPieceIndex].position.x = targetPosition.x;
    piecesState[selectedPieceIndex].position.y = targetPosition.y;
    piecesState[selectedPieceIndex].firstMove = false;

    const timestamp = new Date().getTime();

    turn = ( turn == "white" ) ? "black" : "white";


    database.updateState(gameId, {
        piecesState: JSON.stringify(piecesState),
        lastMove: lastMoveJSON,
        timestamp,
        turn
    });

    return true;

}

async function playerCanMove(playerId, gameId, turn) {

    console.log("Checking if player can move");

    let currentPlayerColor = await database.getPlayerColor(playerId, gameId);

    console.log("currentPlayerColor: " + currentPlayerColor);

    return (currentPlayerColor == turn) ? true : false;

}

module.exports = { movePiece };