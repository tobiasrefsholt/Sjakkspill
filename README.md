
# Project Title

Fullstack chess game where two players can play against each other. Still work in progress. [TODO list](https://github.com/tobiasrefsholt/Sjakkspill/blob/main/TODO.md).

[Try it out here!](https://spaghettigames.no/)
## Tech Stack

**Client:** Typescript

**Server:** Node, Express, mySQL/mariaDB, Typescript


## Lessons Learned

I started this project to learn the basics of node, and working with apis and sql.
## Deployment

Follow these steps to deploy

1. Clone the repository
```
git clone https://github.com/tobiasrefsholt/Sjakkspill.git
```
2. Create DB and user
```
sudo mysql
```
```
MariaDB >

CREATE DATABASE database_name;
CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON database_name.* TO 'username'@'localhost';
FLUSH PRIVILEGES;
```
3. Copy .env.default to .env and configure db credentials and server port
```
# Database credentials
db_host     = "127.0.0.1"
db_user     = ""
db_password = ""
db_name = ""
db_charset  = "utf8"

# Server
hostname    = "127.0.0.1"
port        = 3000
```
4. Build and run project
```
# Install deps
npm install

# Compile javascript for server and client files
npx tsc
npx tsc client/

# Run the app
node bin/app.js

# Alternatively skip compiling and run typescript-files directly
ts-node src/app.ts
```
