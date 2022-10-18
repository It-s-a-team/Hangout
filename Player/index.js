"use strict";

const io = require("socket.io-client");

const url = process.env.SERVER_URL || "http://localhost:3002/hangout";

// Create a Constant variable that will connect the "Socket.io" to the URL
const socket = io.connect(url);

socket.on("gameStart", (payload) => {
  console.log(payload);
});

socket.on("nextTurn", (payload) => {
  console.log(payload);
})

socket.emit("gameStart", "Game Starting!!!");

socket.on('gameOver', (payload) =>  {
  console.log(payload);
});

class Player {
  constructor() {
    this.name = "Dude";
  }
  submitLetter(letter) {
    socket.emit("letterSubmit", letter);
  }
}

let newPlayer = new Player();
newPlayer.submitLetter("j");
