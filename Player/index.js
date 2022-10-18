'use strict';

const io = require('socket.io-client');

// Create a Constant variable to link to the server.
const url = process.env.SERVER_URL || 'http://localhost:3002/hangout';

// Create a Constant variable that will connect the "Socket.io" to the URL
const socket = io.connect(url);

// Create a "Socket.io" function that will start the Player's logic
// The player must first log-in in order to activate the Server
socket.io('playerJoin', (payload) => {
  console.log('LET ME IN!!!')
  console.log(payload);
});

