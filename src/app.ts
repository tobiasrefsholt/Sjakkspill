import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import {createNewGame} from "./createNewGame";
import {joinNewGame} from "./joinGame";
import {getState} from "./getState";
import {currentLegalMoves} from "./getMoves";
import {movePiece} from "./updateState";

dotenv.config();

const app: Express = express();

app.use(express.static('client'));
app.use(express.json());

app.get('/', (req: Request, res: Response): void => {
    res.sendFile('./client/index.html')
});

app.post('/createNewGame', (request: Request, res): void => {
    const apiResponse = createNewGame();
    res.header('Content-Type: application/json');
    res.end(JSON.stringify(apiResponse));
});

app.post('/joinGame', async (req: Request, res: Response) => {
    const apiResponse = await joinNewGame(req.body);
    res.header('Content-Type: application/json');
    res.end(JSON.stringify(apiResponse));
});

app.post('/getstate', async (req: Request, res: Response) => {
    const apiResponse = await getState(req.body);
    res.header('Content-Type: application/json');
    res.end(JSON.stringify(apiResponse));
});

app.post('/getmoves', async (req: Request, res: Response) => {
    const apiResponse = await currentLegalMoves(req.body);
    res.header('Content-Type: application/json');
    res.end(JSON.stringify(apiResponse));
});

app.post('/movepiece', async (req: Request, res: Response) => {
    const apiResponse = await movePiece(req.body);
    res.header('Content-Type: application/json');
    res.end(JSON.stringify(apiResponse));
});

app.listen(process.env.port, () => {
    console.log(`Example app listening on port ${process.env.port}`);
});