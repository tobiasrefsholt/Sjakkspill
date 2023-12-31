import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.sendFile('./public/index.html')
});

app.post('/createNewGame', (request: Request, res): Response => {
    const newGame = require("./src/createNewGame.js");
    const apiResponse = newGame.createNewGame();
    res.header('Content-Type: application/json');
    res.end(JSON.stringify(apiResponse));
});

app.post('/joinGame', async (req: Request, res: Response) => {
    const joinGame = require("./src/joinGame.js");
    const apiResponse = await joinGame.joinNewGame(req.body);
    res.header('Content-Type: application/json');
    res.end(JSON.stringify(apiResponse));
});

app.post('/getstate', async (req: Request, res: Response) => {
    const getState = require("./src/getState.js");
    const apiResponse = await getState.getState(req.body);
    res.header('Content-Type: application/json');
    res.end(JSON.stringify(apiResponse));
});

app.post('/getmoves', async (req: Request, res: Response) => {
    const getMoves = require("./src/getMoves.js");
    const apiResponse = await getMoves.currentLegalMoves(req.body);
    res.header('Content-Type: application/json');
    res.end(JSON.stringify(apiResponse));
});

app.post('/movepiece', async (req: Request, res: Response) => {
    const updateState = require("./src/updateState.js");
    const apiResponse = await updateState.movePiece(req.body);
    res.header('Content-Type: application/json');
    res.end(JSON.stringify(apiResponse));
});

app.listen(process.env.port, () => {
    console.log(`Example app listening on port ${process.env.port}`);
});