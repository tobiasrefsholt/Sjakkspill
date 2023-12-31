const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name,
    charset: process.env.db_charset
});

pool.getConnection((err,connection)=> {
    if(err) throw err;
    console.log('Database connected successfully');
    const gamestateSql = `
        create table if not exists gamestate
        (
            game_id         varchar(255)                 null,
            join_pin        varchar(255)                 null,
            white_player_id varchar(255)                 null,
            black_player_id varchar(255)                 null,
            latest_update   bigint                       null,
            pieces_state    longtext collate utf8mb4_bin null
                check (json_valid(\`pieces_state\`)),
            turn            varchar(255)                 null,
            last_move       longtext collate utf8mb4_bin null
                check (json_valid(\`last_move\`))
        );
    `;
    const playersSql = `
        create table if not exists players
        (
            player_id varchar(255) null,
            game_id   varchar(255) null,
            color     varchar(255) null
        );
    `;
    connection.execute(gamestateSql);
    connection.execute(playersSql);
    connection.release();
});

export = pool;