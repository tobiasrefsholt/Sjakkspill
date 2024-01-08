import database from './database';
import numberGen from './numberGenerator';
import {createSecretKey} from "crypto";

type request = {
    joinPin: string
}

type response = {
    gameId: string,
    playerId: string,
    playerColor: "white" | "black"
}

async function joinNewGame(request: request): Promise<response | { error: string }> {

    // Returner en feilmelding hvis joinPin ikke er en INT
    if (!Number.isInteger(parseInt(request.joinPin))) return {error: "joinPin har et ugyldig format"};

    // Søk opp joinPin i databasen og retuner gameId
    const gameId = await database.getGameIdByPin(request.joinPin);

    if (!gameId) return {error: `joinPin ${request.joinPin} finnes ikke`};

    // Fjern joinpin fra databasen, når gameId er retunert. Pin skal være til en gangs bruk.
    await database.removeJoinPin(gameId);

    const playerId = numberGen.generateId();
    await database.newPlayerEntry(playerId, gameId, "black");

    // Addplayer to gametable
    await database.addBlackPlayerToGamestate(playerId, gameId);

    return {
        gameId,
        playerId,
        playerColor: "black"
    };

}

export = {joinNewGame};