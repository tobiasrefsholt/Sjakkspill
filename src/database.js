const mysql = require('mysql2');

const con = mysql.createConnection({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name,
    charset: process.env.db_charset
});

con.connect(function (err) {

    if (err) throw err;

    console.log("Connected to database!");

});

function newGameEntry(gameId, joinPin, firstPlayerId) {

    const sql = `INSERT INTO gamestate (game_id, join_pin, white_player_id) VALUES('${gameId}', '${joinPin}', '${firstPlayerId}')`;

    con.query(sql, function (err, result) {
        if (err) throw err;
        
        console.log(`New game (game_id = ${gameId}) added to 'gamestate' table`);
    });

}

function newPlayerEntry(playerId, gameId) {

    if (!playerId && !gameId) return;

    const sql = `INSERT INTO players (player_id, game_id) VALUES('${playerId}', '${gameId}')`;

    con.query(sql, function (err, result) {
        if (err) throw err;
        
        gameId = result.id;
        console.log(`New player (playerId = ${playerId}) added to 'players' table`);
    });

    return gameId;
}

async function getGameIdByPin(pin) {

    if (!pin) return;

    const sql = `SELECT * FROM gamestate WHERE join_pin = '${pin}'`;
    console.log(sql);

    const results = await con.promise().query(sql);

    if (results[0].length === 0) return false;

    return results[0][0].game_id;

}

async function removeJoinPin(gameId) {

    if (!gameId) return;

    const sql = `UPDATE gamestate SET join_pin = NULL WHERE game_id = '${gameId}'`;
    console.log(sql);

    con.query(sql, async function (err, result) {
        if (err) throw err;
        
        console.log(result);
    });
    
}

async function getLatestStateTimestamp(gameId) {

    const sql = `SELECT latest_update FROM gamestate WHERE game_id = '${gameId}'`;
    console.log(sql);

    const results = await con.promise().query(sql);

    if (results[0][0].length === 0) return false;

    return results[0][0].latest_update;

}

async function getCurrentState(gameId) {

    const sql = `SELECT pieces_state, turn FROM gamestate WHERE game_id = '${gameId}'`;
    console.log(sql);

    const results = await con.promise().query(sql);

    if (results[0][0].length === 0) return false;

    return results[0][0];

}

async function updateState(gameId, state) {

    const sql = `UPDATE gamestate
        SET
            pieces_state = '${state.piecesState}',
            turn = '${state.turn}',
            latest_update = '${state.timestamp}'
        WHERE
            game_id = '${gameId}'
    `;
    console.log(sql);

    con.query(sql, async function (err, result) {
        if (err) throw err;
        
        console.log(result);
    });
}

module.exports = { newGameEntry, newPlayerEntry, getGameIdByPin, removeJoinPin, getLatestStateTimestamp, getCurrentState, updateState }