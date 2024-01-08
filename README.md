# Sjakkspill
Online sjakk hvor du kan spille mot andre over internett. Spillet fungerer slik det er nå, men mangler forstatt en del funksjoner som forhåpentligvis kommer etterhvert! [TODO-liste](https://github.com/tobiasrefsholt/Sjakkspill/blob/main/TODO.md)

## Requirements
1. MySql/MariaDB
2. Node

## Setup
1. Clone the repository
2. Create DB and user
3. Copy .env.default to .env and configure credentials
4. Run "npm install" to install dependencies
5. Run "tsc -p client/" to compile client side typescript to javascript
6. Run "ts-node src/app.ts" to run node app directly, without compiling to js first
