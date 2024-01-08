"use strict";

type model = {
    app: app;
    fields: fields;
    icons: pieceIcons;
    gameState: gameState;
    piecesState: piecesState;
    errorMessages: { join: string | null };
}

type app = {
    currentView: string | null;
}

type fields = {
    gameName: string | null;
}

type pieceIcon = "♟" | "♝" | "♞" | "♜" | "♛" | "♚";

type pieceIcons = {
    pawn: pieceIcon;
    bishop: pieceIcon;
    knight: pieceIcon;
    rook: pieceIcon;
    queen: pieceIcon;
    king: pieceIcon;
}

type coordinate = {
    x: number | null;
    y: number | null;
}

type gameState = {
    joinPin: string | null;
    gameReady: boolean;
    gameId: string | null;
    playerId: string | null;
    playerColor: "white" | "black" | null;
    lastChange: number | null;
    lastMove: {
        color: "white" | "black" | null;
        from: coordinate | null;
        to: coordinate | null;
    };
    turn: null;
    opponentName: string | null;
}

type piece = {
    position: coordinate;
    type: "pawn" | "bishop" | "knight" | "rook" | "queen" | "king";
    color: "white" | "black";
    firstMove: boolean;
    disabled: boolean;
}

type piecesState = {
    pieces: piece[];
    selectedIndex: number | null;
    currentLegalMoves: coordinate[] | null;
    latestOpponentMove: coordinate | null;
    transcript: [];
}

const model: model = {
    app: {
        currentView: "main-menu"
    },
    fields: {
        gameName: null
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
        gameReady: false,
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
        latestOpponentMove: null,
        transcript: []
    },
    errorMessages: {
        join: null,
    },
}