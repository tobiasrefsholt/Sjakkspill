# Sjakkspill TODO
Ideer til å forbedre spillet

## TODO Node backend
 - [x] Sette opp databasekobling i node
 - [ ] Sette opp api endpoints
   - [x] /createnewgame - Generer IDer og legger inn en database entry, returnerer gameID, joinPIN og playerID til klienten.
   - [x] /joinGame - Spiller to kan oppgi en sekssifret kode for å få tilgang til spillet. playerID blir generert/retunert og gameID blir retunert
   - [ ] /syncState - Client kaller denne med noen sekunders mellomrom. Sjekker om det er en endring på brettet siden sist. Hvis det er en ending, retuneres piecesState variablen.
   - [ ] /calculateLegalMoves - Returnerer lovilige trekk for en spesifikk brikke.
   - [ ] /movePiece - Flytter en brikke til et lovlig felt. Returnerer også piecesState variablen.
  - [ ] Flytte all logikk som har med å kalkulere trekk, over på backend.

## Gjenkjenne stillinger
 - [ ] Vunnet stilling
 - [ ] Sjakk
   - [ ] Hindre spilleren i å gjøre ulovlige trekk
 - [ ] Rokade
 - [ ] Bytte bonde til ny brikke, hvis på andre siden av brettet

## Andre funksjoner
- [ ] Bedre mobiltilpasning
- [ ] Klokke
- [ ] Fischersjakk?
- [x] Vise utslåtte brikker ved siden av brettet
