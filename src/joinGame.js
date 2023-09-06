const database = require('./database');
const numberGen = require('./numberGenerator');

async function joinNewGame(request) {

    // Returner en feilmelding hvis joinPin ikke er en INT
    if (!Number.isInteger(parseInt(request.joinPin))) return {error: "joinPin har et ugyldig format"};

    request.joinPin = parseInt(request.joinPin);

    // Søk opp joinPin i databasen og retuner gameId
    const gameId = await database.getGameIdByPin(request.joinPin);

    if (!gameId) return {error: `joinPin ${request.joinPin} finnes ikke`};

    // Fjern joinpin fra databasen, når gameId er retunert. Pin skal være til en gangs bruk.
    await database.removeJoinPin(gameId);

    const playerId = numberGen.generateId();

    await database.newPlayerEntry(playerId, gameId);

    return {
        playerId,
        gameId
    };

}

module.exports = { joinNewGame };