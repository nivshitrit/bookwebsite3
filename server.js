const express = require('express');
const path = require('path');
const app = express();
let count = 0;

app.get('/count', (req, res) => {
    res.send({ count: count })
});
app.post('/count', (req, res) => {
    count++;
    res.send({ count: count })
});
app.get('/', (req, res) => res.sendFile(path.resolve("pages/index.html")));
app.listen(3000);