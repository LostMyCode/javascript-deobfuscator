/* eslint-disable no-unused-vars */
// index.js
const functions = require('firebase-functions');
const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const decoder = require("./xDecoder")();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ extended: true, limit: '10mb' }));

app.get('/hello', (req, res) => { // test page
    res.send('Hello Express!');
});

app.post("/request", (req, res, next) => {
    // console.log(req.body.code)

    const decoded = decoder.decode(req.body.type, req.body.targetName, req.body.code);
    res.send(decoded);
});

// ここに`cors()`を追加(一部でcors使いたい場合)
/* app.get('/asd/:keyword', cors(), (req, res) => {
}); */

const api = functions.https.onRequest(app);
module.exports = { api };