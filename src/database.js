const pool = require('./databaseConnection.js')

async function newGameEntry(gameId, joinPin, firstPlayerId) {
    const sql = `
        INSERT INTO gamestate (game_id, join_pin, white_player_id)
        VALUES (?, ?, ?)
    `;

    pool.getConnection(async (err, connection) => {
        await connection.execute(sql, [gameId, joinPin, firstPlayerId]);
        console.log(`New game (game_id = ${gameId}) added to 'gamestate' table`);
        pool.releaseConnection(connection);
    });
}

function newPlayerEntry(playerId, gameId, color) {

    if (!playerId && !gameId) return;

    const sql = `
        INSERT INTO players (player_id, game_id, color)
        VALUES (?, ?, ?)
    `;

    pool.execute(sql, [playerId, gameId, color], (err) => {
        if (err) throw err;
        console.log(`New player (playerId = ${playerId}) added to 'players' table`);
    });
}

function addBlackPlayerToGamestate(playerId, gameId) {

    if (!playerId && !gameId) return;

    const sql = `
        UPDATE gamestate
        SET black_player_id = ?
        WHERE game_id = ?
    `;

    pool.execute(sql, [playerId, gameId], function (err, result) {
        if (err) throw err;

        gameId = result.id;
        console.log(`New player (playerId = ${playerId}) added to 'gamestate' table`);
    });
}

async function getPlayerColor(playerId, gameId) {

    if (!playerId && !gameId) return;

    const sql = `
        SELECT color
        FROM players
        WHERE player_id = ?
          AND game_id = ?
    `;

    const results = await pool.promise().execute(sql, [playerId, gameId]);

    return results[0][0]?.color;

}

async function getGameIdByPin(pin) {

    if (!pin) return;

    const sql = `
        SELECT game_id
        FROM gamestate
        WHERE join_pin = ?
    `;

    const results = await pool.promise().execute(sql, [pin]);

    if (results[0].length === 0) return false;

    return results[0][0].game_id;

}

async function removeJoinPin(gameId) {

    if (!gameId) return;

    const sql = `
        UPDATE gamestate
        SET join_pin = NULL
        WHERE game_id = '${gameId}'
    `;

    pool.execute(sql, [gameId]);

}

async function getLatestStateTimestamp(gameId) {

    const sql = `
        SELECT latest_update
        FROM gamestate
        WHERE game_id = ?
    `;

    const results = await pool.promise().execute(sql, [gameId]);

    if (results[0][0].length === 0) return false;

    return results[0][0].latest_update;

}

async function getCurrentState(gameId) {

    const sql = `
        SELECT pieces_state, turn, last_move
        FROM gamestate
        WHERE game_id = '${gameId}'
    `;

    const results = await pool.promise().query(sql);

    if (results[0][0].length === 0) return false;

    return results[0][0];

}

async function updateState(gameId, state) {

    const sql = `
        UPDATE gamestate
        SET pieces_state  = ?,
            turn          = ?,
            latest_update = ?,
            last_move     = ?
        WHERE game_id = ?
    `;
    
    const params = [state.piecesState, state.turn, state.timestamp, state.lastMove ?? null, gameId];
    console.log(params);

    await pool.promise().execute(sql, params);
}

async function checkGameReady(gameId) {

    const sql = `
        SELECT black_player_id
        FROM gamestate
        WHERE game_id = ?
    `;

    const results = await pool.promise().execute(sql, [gameId]);

    if (!results[0][0].hasOwnProperty("black_player_id")) return false;
    return (results[0][0].black_player_id !== null);
}

module.exports = {
    newGameEntry,
    newPlayerEntry,
    addBlackPlayerToGamestate,
    getPlayerColor,
    getGameIdByPin,
    removeJoinPin,
    getLatestStateTimestamp,
    getCurrentState,
    updateState,
    checkGameReady
}