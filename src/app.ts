import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import newGame from "./createNewGame";
import joinGame from"./joinGame";
import getState from"./getState";
import getMoves from "./getMoves";
import updateState from "./updateState";

dotenv.config();

const app: Express = express();

app.use(express.static('client'));
app.use(express.json());

app.get('/', (req: Request, res: Response): void => {
    res.sendFile('./client/index.html')
});

app.post('/createNewGame', (request: Request, res): void => {
    const apiResponse = newGame.createNewGame();
    res.header('Content-Type: application/json');
    res.end(JSON.stringify(apiResponse));
});

app.post('/joinGame', async (req: Request, res: Response) => {
    const apiResponse = await joinGame.joinNewGame(req.body);
    res.header('Content-Type: application/json');
    res.end(JSON.stringify(apiResponse));
});

app.post('/getstate', async (req: Request, res: Response) => {
    const apiResponse = await getState.getState(req.body);
    res.header('Content-Type: application/json');
    res.end(JSON.stringify(apiResponse));
});

app.post('/getmoves', async (req: Request, res: Response) => {
    const apiResponse = await getMoves.currentLegalMoves(req.body);
    res.header('Content-Type: application/json');
    res.end(JSON.stringify(apiResponse));
});

app.post('/movepiece', async (req: Request, res: Response) => {
    const apiResponse = await updateState.movePiece(req.body);
    res.header('Content-Type: application/json');
    res.end(JSON.stringify(apiResponse));
});

app.listen(process.env.port, () => {
    console.log(`Example app listening on port ${process.env.port}`);
});