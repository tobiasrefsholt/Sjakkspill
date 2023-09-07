const database = require('./database');

async function getState(request) {

    /* 
        request = {
            gameId,
            playerId,
            lastChange // Timestamp på siste sync
        }
    */

    if (!request.gameId) return { error: "Ingen gameId definert, eller ugyldig format" };
    if (!request.playerId) return { error: "Ingen playerId definert, eller ugyldig format" };

    // Set default til true, sånn at man forcer en update om man ikke sender med lastChange fra klienten.
    let stateHasChanged = true;

    // Hvis request inneholder siste oppdateringstid, sjekk om den er eldre enn versjonen i databasen.
    // Hvis ikke, retuner false til clienten, ellers forstetter koden.
    const latestServerTimestamp = await database.getLatestStateTimestamp(request.gameId);
    console.log("latestServerTimestamp: " + latestServerTimestamp);

    if (latestServerTimestamp <= request.lastChange) {
        stateHasChanged = false;
    }

    if (!stateHasChanged) return { hasChanged: false };

    let state = await database.getCurrentState(request.gameId); // Returnerer objekt {piecesState (JSON), turn}

    return {
        hasChanged: stateHasChanged,
        turn: state.turn,
        lastChange: latestServerTimestamp,
        piecesState: state.pieces_state
    };

}

module.exports = { getState };