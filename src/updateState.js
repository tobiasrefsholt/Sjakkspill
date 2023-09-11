
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