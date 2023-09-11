const database = require('./database');

let piecesState;
let turn;

async function currentLegalMoves(request) {

    if (!request.gameId) return {"error": "GameId not defined"};
    if (!request.selectedPieceIndex && request.selectedPieceIndex !== 0) return {"error": "selectedPieceIndex not defined"};
    
    let selectedPieceIndex = parseInt(request.selectedPieceIndex);
    let state = await database.getCurrentState(request.gameId); /* Returns {piecesState, turn} if gameId exists, else false */
    
    piecesState = state.pieces_state;
    turn = state.turn;

    if (!state) return {"error": "GameId not found in database"};

    let legalMoves = calculateLegalMoves(selectedPieceIndex); /* Returns array of coordinate objects */

    if (legalMoves.error) return legalMoves.error;

    return legalMoves;

}

function calculateLegalMoves(selectedPieceIndex) {
   
    let selectedPiece = piecesState[selectedPieceIndex];
    let moves;
    let legalMoves = [];

    switch (selectedPiece.type) {
        case "pawn":
            moves = calculateLegalMovesPawn(selectedPiece);
            break;
        case "bishop":
            moves = calculateLegalMovesBishop(selectedPiece);
            break;
        case "knight":
            moves = calculateLegalMovesKnight(selectedPiece);
            break;
        case "rook":
            moves = calculateLegalMovesRook(selectedPiece);
            break;
        case "queen":
            moves = calculateLegalMovesQueen(selectedPiece);
            break;
        case "king":
            moves = calculateLegalMovesKing(selectedPiece);
            break;
        default:
            return {"error": "Ugylidg brikke"};
    }

    // Remove fields outside board
    for (let i=0; i<moves.length; i++) {
        if ((moves[i].x <= 8) && (moves[i].x >= 1) && (moves[i].y <= 8) && (moves[i].y >= 1)) {
            legalMoves.push(moves[i]);
        }
    }

    return legalMoves;

}

function calculateLegalMovesPawn(currentPawn) {

    let legalMoves = [];
    // Definer hvilke regler som gjelder
    let currentRange = currentPawn.firstMove ? [1,2] : [1];

    // Definer offsetModifier som 1 eller -1, avhengig av fargen på brikken. Brukes for å snu om på lovlige trekk for svarte brikker.
    let offsetModifier;
    if (currentPawn.color == "white") {
        offsetModifier = 1;
    } else {
        offsetModifier = -1;
    }

    // Sjekk om bonden har noen å angripe (diagonalt)
    let attackRange = [
        {x: currentPawn.position.x + 1 * offsetModifier, y: currentPawn.position.y + 1 * offsetModifier },
        {x: currentPawn.position.x + -1 * offsetModifier, y: currentPawn.position.y + 1 * offsetModifier }
    ]
    if ( currentPieceCanAttack(currentPawn, attackRange[0]) ) {
        legalMoves.push(attackRange[0])
    }
    if ( currentPieceCanAttack(currentPawn, attackRange[1]) ) {
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

    let targetPiece = getPieceIndexByPosition(targetCell);
    
    if (!targetPiece && targetPiece !== 0) {
        return false;
    }

    return piecesState[targetPiece].color;

}

function currentPieceCanAttack(selectedPiece, target) {

    if (!piecesState[getPieceIndexByPosition(target)]) {
        return false;
    }

    let targetPiece = piecesState[getPieceIndexByPosition(target)];

    if (targetPiece.color == selectedPiece.color) {
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

module.exports = { currentLegalMoves };