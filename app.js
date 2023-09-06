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
})

app.post('/createNewGame', (request, response) => {
    const newGame = require("./src/createNewGame.js");
    const APIresponse = newGame.createNewGame();
    response.header('Content-Type: application/json');
    response.end(JSON.stringify(APIresponse));
})

app.post('/joinGame', async (request, response) => {
    const joinGame = require("./src/joinGame.js");
    const apiResponse = await joinGame.joinNewGame(request.body);
    response.header('Content-Type: application/json');
    response.send(apiResponse);
})

app.listen(process.env.port, () => {
    console.log(`Example app listening on port ${process.env.port}`)
})