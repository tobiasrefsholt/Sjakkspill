const http = require('http');
const express = require('express');
const app = express();
const serverRoot = __dirname;

require('dotenv').config()

app.use(express.static('public'));
app.use(express.json());
//app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.sendFile('./public/index.html')
});

app.post('/createNewGame', (request, response) => {
    const newGame = require("./src/createNewGame.js");
    const apiResponse = newGame.createNewGame();
    response.header('Content-Type: application/json');
    response.end(JSON.stringify(apiResponse));
});

app.post('/joinGame', async (request, response) => {
    const joinGame = require("./src/joinGame.js");
    const apiResponse = await joinGame.joinNewGame(request.body);
    response.header('Content-Type: application/json');
    response.send(apiResponse);
});

app.post('/getstate', async (request, response) => {
    const getState = require("./src/getState.js");
    const apiResponse = await getState.getState(request.body);
    response.header('Content-Type: application/json');
    response.send(apiResponse);
});

app.post('/getmoves', async (request, response) => {
    const getMoves = require("./src/getMoves.js");
    const apiResponse = await getMoves.currentLegalMoves(request.body);
    response.header('Content-Type: application/json');
    response.send(apiResponse);
});

app.post('/movepiece', async (request, response) => {
    const updateState = require("./src/updateState.js");
    const apiResponse = await updateState.movePiece(request.body);
    response.header('Content-Type: application/json');
    response.send(apiResponse);
});

app.listen(process.env.port, () => {
    console.log(`Example app listening on port ${process.env.port}`);
});