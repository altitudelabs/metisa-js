const express = require('express');
const app = express();

const Metisa = require('../../src/node')({ apiKey: 'testing key' });

const returnMetisa = require('./return-metisa');

console.log('is initialised Metisa reused ?', returnMetisa() === Metisa);

const server = require('http').createServer(app);

server.listen(3000, () => {
  console.log('Express server listening on %d', 3000);
});
