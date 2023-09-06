const database = require('./database');
const numberGen = require('./numberGenerator');

function createNewGame() {
    
    const gameId = numberGen.generateId();
    const joinPin = numberGen.generatePin();
    const firstPlayerId = numberGen.generateId();
    
    database.newGameEntry(gameId, joinPin, firstPlayerId);
    database.newPlayerEntry(firstPlayerId, gameId);

    return {
        gameId,
        joinPin,
        playerId: firstPlayerId,
    };
}

module.exports = { createNewGame };