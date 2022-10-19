"use strict";

const io = require("socket.io-client");

const url = process.env.SERVER_URL || "http://localhost:3002/hangout";

// Create a Constant variable that will connect the "Socket.io" to the URL
const socket = io.connect(url);

socket.on("gameStart", (payload) => {
  console.log(payload);
});

socket.on("chat", (message) => console.log(message));

socket.on("nextTurn", (payload) => {
  console.log(payload);
});

socket.on("newRoom", (payload) => console.log("rooms available", payload));

socket.emit("gameStart", "Game Starting!!!");

socket.on("gameOver", (payload) => {
  console.log(payload);
});

class Player {
  constructor() {
    this.name = "Dude";
  }
  submitLetter(letter) {
    socket.emit("letterSubmit", letter);
  }
  join(room) {
    socket.emit("join", room);
  }
  chat(message) {
    socket.emit("chat", message);
  }
}

let newPlayer = new Player();
// newPlayer.join("1234");
// newPlayer.chat("whats up");
// newPlayer.submitLetter("o");
