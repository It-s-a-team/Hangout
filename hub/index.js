"use strict";

const io = require("socket.io");
const eventPool = require("./eventPool");
const PORT = process.env.PORT || 3002;
const randomWords = require("random-words");

const server = io(PORT);
const hangout = server.of("/hangout");
console.log(`Server is listening on port: ${PORT}/hangout`);

hangout.on("connection", (socket) => {
  console.log(`New Player connected!!!`, socket.id);

  socket.on("gameStart", (payload) => {
    payload = {
      turn: newGame.turn,
      lives: newGame.lives,
      currentWord: newGame.currentWord,
    };

    socket.emit("gameStart", payload);
  });

  socket.on("join", (payload) => {
    console.log("join", payload);

    socket.join(payload);
    hangout.emit("newRoom", "1234");
  });

  socket.on("chat", (message) => {
    console.log(message);
    hangout.to("1234").emit("chat", message);
    // hangout.emit("chat", message);
  });

  socket.on("letterSubmit", (payload) => {
    console.log(payload);

    // Creating a variable for the new word
    let newWord = newGame.handleLetterSubmit(payload);
    let anyX = newGame.currentWord.includes("X");
    console.log("I'm Here", newGame.currentWord);
    console.log(anyX);
    if (anyX === true && newGame.lives > 0) {
      socket.emit("nextTurn", "Your're Next!");
    } else {
      if (anyX === false) {
        socket.emit("gameOver", "Congratulations, YOU WON!");
      } else {
        socket.emit("gameOver", "Sorry, you lost");
      }
    }
  });
});

class Game {
  constructor(props) {
    this.roomName = props.roomName;
    this.players = props.players;
    this.turn = this.players[0];
    this.lives = props.lives;
    this.difficulty = props.difficulty;
    this.secretWord = props.secretWord;
    this.currentWord = props.currentWord;
    this.strLeft = "";
    this.messages = props.message;
  }

  handleDifficulty() {
    if (this.difficulty === "easy") {
      this.lives = 6;
      this.secretWord = this.getRandomString(5);
    } else if (this.difficulty === "medium") {
      this.lives = 4;
      this.secretWord = this.getRandomString(7);
    } else if (this.difficulty === "hard") {
      this.lives = 2;
      this.secretWord = this.getRandomString(9);
    }
    this.strLeft = this.secretWord;

    this.makeNewCurrentStr();
  }

  makeNewCurrentStr() {
    let word = "";
    for (let i = 0; i < this.secretWord.length; i++) {
      word = word.concat("X");
    }
    this.currentWord = word;
  }

  getRandomString(length) {
    let str = "";
    do {
      str = randomWords({ exactly: 1, maxLength: length })[0];
      console.log(str);
    } while (str.length !== length);
    return str;
  }

  handleLetterSubmit(letter) {
    console.log("handleLetter", letter);

    if (this.strLeft.includes(letter)) {
      let newWord = this.currentWord;
      let tempStr = this.secretWord;
      console.log(`newWord ${newWord}, tempStr ${tempStr}`);

      while (tempStr.includes(letter)) {
        let index = tempStr.indexOf(letter);
        tempStr =
          tempStr.substring(0, index) +
          "X" +
          tempStr.substring(index + 1, tempStr.length);

        newWord =
          newWord.substring(0, index) +
          letter +
          newWord.substring(index + 1, this.currentWord.length);
      }

      console.log(tempStr, newWord);
      this.strLeft = tempStr;
      this.currentWord = newWord;
      return newWord;
    } else {
      --this.lives;
      let message = "Sorry, no letter in word";
      console.log(message, `You have ${this.lives} left`);
      return message;
    }
  }
}

let newGame = new Game({
  roomName: "1234",
  players: ["player1", "player2"],
  difficulty: "hard",
});
newGame.handleDifficulty();

console.log(newGame);
