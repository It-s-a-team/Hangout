'use strict';

const io = require('socket.io-client');

const url = process.env.SERVER_URL || 'http://localhost:3002/hangout';

const socket = io.connect(url);

socket.on('gameStart', (payload) => {
  console.log(payload);
});

socket.emit('gameStart', 'Game Starting!!!');

class Player {
  constructor() {
    this.name = 'Dude';
  }
  submitLetter(letter) {
    socket.emit('letterSubmit', letter);
  }
}

let newPlayer = new Player();
newPlayer.submitLetter('p');
