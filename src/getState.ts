import database from './database';

type getStateRequest = {
    gameId: string,
    playerId: string,
    lastChange: number,
    checkGameReady: boolean
}

type response = {
    hasChanged: boolean,
    turn: "white" | "black",
    lastChange: number,
    lastMove: any,
    piecesState: any
}

async function getState(request: getStateRequest) {

    // Validate request
    if (!request.gameId) return {error: "Ingen gameId definert, eller ugyldig format"};
    if (!request.playerId) return {error: "Ingen playerId definert, eller ugyldig format"};

    // Return gameready: true | false if checkGameReady is set in the request
    if (request.checkGameReady) {
        const gameReady = await database.checkGameReady(request.gameId);
        return {gameReady};
    }

    return getGameStateObject(request);

}

async function getGameStateObject(request: getStateRequest) : Promise<response | { hasChanged: boolean }> {
    // Check if client is up to date with database
    const latestServerTimestamp = await database.getLatestStateTimestamp(request.gameId);
    const stateHasChanged = request.lastChange < latestServerTimestamp || !request.lastChange;

    // Early return if client is up to date
    if (!stateHasChanged) return {hasChanged: false};

    // Get state from database if client is out of sync
    const state = await database.getCurrentState(request.gameId); // Returns object: {piecesState (JSON), turn}

    return {
        hasChanged: true,
        turn: state.turn,
        lastChange: latestServerTimestamp,
        lastMove: state.last_move,
        piecesState: state.pieces_state
    };
}

export = {getState};