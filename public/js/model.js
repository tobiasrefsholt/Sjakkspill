"use strict";

const model = {
    app: {
        currentView: "main-menu"
    },
    icons: {
        pawn: "♟",
        bishop: "♝",
        knight: "♞",
        rook: "♜",
        queen: "♛",
        king: "♚"
    },
    gameState: {
        joinPin: null,
        gameReady: null,
        gameId: null,
        playerId: null,
        playerColor: null,
        lastChange: null,
        lastMove: {
            color: null,
            from: {
                x: null,
                y: null,
            },
            to: {
                x: null,
                y: null,
            }
        },
        turn: null,
        opponentName: null
    },
    piecesState: {
        pieces: [],
        selectedIndex: null,
        currentLegalMoves: [],
        latestOpponentMove: {
            from: [],
            to: []
        },
        transcript: []
    },
    errorMessages: {
        join: null,
    },
}