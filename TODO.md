# Sjakkspill TODO
Ideer til å forbedre spillet

## TODO Node backend
 - [x] Sette opp databasekobling i node
 - [x] Sette opp api endpoints
   - [x] /createnewgame - Generer IDer og legger inn en database entry, returnerer gameID, joinPIN og playerID til klienten.
   - [x] /joinGame - Spiller to kan oppgi en sekssifret kode for å få tilgang til spillet. playerID blir generert/retunert og gameID blir retunert
   - [x] /syncState - Client kaller denne med noen sekunders mellomrom. Sjekker om det er en endring på brettet siden sist. Hvis det er en ending, retuneres piecesState variablen.
   - [x] /calculateLegalMoves - Returnerer lovilige trekk for en spesifikk brikke.
   - [x] /movePiece - Flytter en brikke til et lovlig felt. Returnerer også piecesState variablen.
  - [x] Flytte all logikk som har med å kalkulere trekk, over på backend.
  - [ ] Dobbeltsjekk at en brikke er lovlig å flytte når /movepiece blir kalt.
  - [ ] Sjekke muligheten for å "pushe" endringer fra server til klient, i motseting til pulling metoden.
     - Server sent events
       - https://www.digitalocean.com/community/tutorials/nodejs-server-sent-events-build-realtime-app
       - https://github.com/lucasjellema/nodejs-serversentevents-quickstart/tree/master
       - https://technology.amis.nl/frontend/server-sent-events-from-node-js-to-web-client-pushing-user-command-line-input-to-all-subscribed-browser-sessions/
       - https://blog.q-bit.me/how-to-use-nodejs-for-server-sent-events-sse/
  - [ ] Legge til en cronjob som fjerner inaktive spill eldre enn x antall dager

## Gjenkjenne stillinger
 - [ ] Vunnet stilling
 - [ ] Sjakk
   - [ ] Hindre spilleren i å gjøre ulovlige trekk
 - [ ] Rokade
 - [ ] Bytte bonde til ny brikke, hvis på andre siden av brettet

## Andre funksjoner
- [x] Lagre gameId og playerId som en cookie eller lignende. Dette er for å kunne regenerere modellen hvis vinduet blir lastet på nytt.
- [x] Markere siste trekk fra motstander i en annen farge
- [ ] Logg over utførte trekk
- [ ] Bedre mobiltilpasning
- [ ] Klokke
- [ ] Fischersjakk?
- [x] Vise utslåtte brikker ved siden av brettet

## Kjente bugs
- [ ] Det skal ikke være mulig å hoppe over andre brikker med bonden (på første trekk når den kan bevege seg to felter)
