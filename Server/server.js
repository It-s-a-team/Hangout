'use strict';

//Required URL's, NPM packages, and servers

const io = require('socket.io-client');
const eventPool = require('./eventPool.js');
const PORT = process.env.PORT || 3002;
const server = io(PORT);
const player = server.of('./player');
console.log(`Server is listening on port: ${PORT}/player`);

// Run whenever a new player has joined the room to play
player.on('connection', (socket) => {
  console.log('New Player has joined! ', socket.id);
});

