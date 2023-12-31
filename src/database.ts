import pool from './databaseConnection';

async function newGameEntry(gameId, joinPin, firstPlayerId) {
    const sql = `
        INSERT INTO gamestate (game_id, join_pin, white_player_id)
        VALUES (?, ?, ?)
    `;

    await pool.getConnection(async (err, connection) => {
        await connection.execute(sql, [gameId, joinPin, firstPlayerId]);
        console.log(`New game (game_id = ${gameId}) added to 'gamestate' table`);
        pool.releaseConnection(connection);
    });
}

async function newPlayerEntry(playerId, gameId, color) {

    if (!playerId && !gameId) return;

    const sql = `
        INSERT INTO players (player_id, game_id, color)
        VALUES (?, ?, ?)
    `;

    await pool.promise().execute(sql, [playerId, gameId, color], (err) => {
        if (err) throw err;
        console.log(`New player (playerId = ${playerId}) added to 'players' table`);
    });
}

async function addBlackPlayerToGamestate(playerId, gameId) {

    if (!playerId && !gameId) return;

    const sql = `
        UPDATE gamestate
        SET black_player_id = ?
        WHERE game_id = ?
    `;

    await pool.promise().execute(sql, [playerId, gameId], function (err, result) {
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
    return results[0][0]?.game_id ?? null;
}

async function removeJoinPin(gameId) {

    if (!gameId) return;

    const sql = `
        UPDATE gamestate
        SET join_pin = NULL
        WHERE game_id = ?
    `;

    await pool.promise().execute(sql, [gameId]);
}

async function getLatestStateTimestamp(gameId) {

    const sql = `
        SELECT latest_update
        FROM gamestate
        WHERE game_id = ?
    `;

    const results = await pool.promise().execute(sql, [gameId]);
    return results[0][0]?.latest_update ?? null;
}

async function getCurrentState(gameId) {

    const sql = `
        SELECT pieces_state, turn, last_move
        FROM gamestate
        WHERE game_id = ?
    `;

    const results = await pool.promise().execute(sql, [gameId]);
    return results[0][0] ?? null;
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

    await pool.promise().execute(sql, [state.piecesState, state.turn, state.timestamp, state.lastMove ?? null, gameId]);
}

async function checkGameReady(gameId) {

    const sql = `
        SELECT black_player_id
        FROM gamestate
        WHERE game_id = ?
    `;

    const results = await pool.promise().execute(sql, [gameId]);
    return (results[0][0]?.black_player_id !== null);
}

export = {
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