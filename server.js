const express = require('express');
require('dotenv').config();
const path = require('path');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.static('client/build'));

app.get('/api/v1', (_, res) => {
    res.json({ message: 'Hello sur API' });
});

app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`le serveur est lancé sur le port : ${PORT}`)
});