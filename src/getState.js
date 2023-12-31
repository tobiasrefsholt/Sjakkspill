const database = require('./database');

async function getState(request) {

    /* 
        request = {
            gameId,
            playerId,
            lastChange // Timestamp på siste sync
            checkGameReady: true | false
        }
    */

    // Validate request
    if (!request.gameId) return {error: "Ingen gameId definert, eller ugyldig format"};
    if (!request.playerId) return {error: "Ingen playerId definert, eller ugyldig format"};

    // Return gameready: true | false if checkGameReady is set in the request
    if (request.checkGameReady) {
        let gameReady = await database.checkGameReady(request.gameId);
        return {gameReady};
    }

    return await getGameStateObject(request);

}

async function getGameStateObject(request) {
    // Check if client is up to date with database
    const latestServerTimestamp = await database.getLatestStateTimestamp(request.gameId);
    const stateHasChanged = request.lastChange > latestServerTimestamp || request.lastChange === null;

    // Early return if client is up to date
    if (!stateHasChanged) return {hasChanged: false};

    // Get state from database if client is out of sync
    let state = await database.getCurrentState(request.gameId); // Returns object: {piecesState (JSON), turn}

    return {
        hasChanged: true,
        turn: state.turn,
        lastChange: latestServerTimestamp,
        lastMove: state.last_move,
        piecesState: state.pieces_state
    };
}

module.exports = {getState};