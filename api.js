const express = require('express');


const app = express();
const server = require('http').Server(app);

const PORT = 3000

// Para o node/express entender o JSON
app.use(express.json());

// Rotas da API
app.use(require('./routes'));

server.listen(PORT, () =>
  console.log('REST-API for client-side iniciada na porta ' + PORT));
