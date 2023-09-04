const http = require('http');
const express = require('express');
const app = express();

require('dotenv').config()

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.listen(process.env.port, () => {
    console.log(`Example app listening on port ${process.env.port}`)
})