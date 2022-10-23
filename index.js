"use strict";

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const randomWords = require("random-words");
let newGame = null;
// import the auth0 functionality
const verifyUser = require("./src/modules/auth/auth");

const PORT = process.env.PORT || 3002;

app.use(cors());

const server = http.createServer(app);

let rooms = [];
let chatLogs = [];

const io = new Server(server, {
  cors: {
    // `origin` is ordinarily url of front-end
    // allow all origin URLs (which allows us to do multiplayer sockets)
    origin: "*",
    credentials: true,
    methods: [ "GET", "POST" ],
  },
});

// /hangout namespace on our instance of 'io'
const hangout = io.of("hangout");

// function to verify the integrity of the token and grant authorization to move on to join a room
hangout.use((socket, next) =>
{
  // check if there is an auth token in our socket.io handshake object from the front-end
  if (socket.handshake.auth.token)
  {
    // call the `verifyUser` function in the `auth.js` file
    // this function accepts two parameters: the user's token and a callback(errors)
    verifyUser(socket.handshake.auth.token, async (err, user) =>
    {
      // error first, approach
      if (err)
      {
        // log the error
        console.log(err);
        next(new Error("token not valid"));
      }
      else
      {
        next();
      }
    });
  } else
  {
    next(new Error("invalid"));
  }
});

// as soon as the client's token is verified, the `.next()` will send them here and let the client connect
hangout.on("connection", (socket) =>
{
  socket.on("gameStart", (payload) =>
  {
    newGame = new Game({
      roomName: "1234",
      players: [ "player1", "player2" ],
      difficulty: payload.difficulty,
    });

    newGame.handleDifficulty();
    let newPayload = {
      turn: newGame.turn,
      lives: newGame.lives,
      currentWord: newGame.currentWord,
    };

    socket.emit("gameStart", newPayload);
  });

  socket.on("join", async (payload) =>
  {
    if (payload.oldRoom)
    {
      socket.leave(payload.oldRoom);
    }

    socket.join(payload.newRoom);

    let newPlayerList = await hangout
      .in(payload.newRoom)
      .fetchSockets()
      .then((arr) =>
      {
        let players = arr.map((sock) =>
        {
          return sock.id;
        });
        return players;
      });

    if (rooms.includes(payload.newRoom))
    {
      // console.log("got it boss");
    }
    else
    {
      rooms.unshift(payload.newRoom);
    }
    // else make new room and add player
    hangout.emit("newRoom", {
      rooms,
      newPlayerList,
    });
  });

  socket.on("testing", (payload) => console.log(payload));

  socket.on("chat", (payload) =>
  {
    chatLogs.unshift(payload.message);
    hangout.to(payload.room).emit("chat", chatLogs);
  });

  socket.on("letterSubmit", (payload) =>
  {
    console.log(payload);

    // Creating a variable for the new word
    let response = newGame.handleLetterSubmit(payload);
    let anyX = newGame.currentWord.includes("X");
    let newPayload = {
      turn: newGame.turn,
      lives: newGame.lives,
      currentWord: newGame.currentWord,
      gameMessage: "",
    };

    if (anyX === true && newGame.lives > 0)
    {
      newPayload.gameMessage = response;
      socket.emit("nextTurn", newPayload);
    }
    else
    {
      if (anyX === false)
      {
        newPayload.gameMessage = "Congratulations, YOU WON!";
        socket.emit("gameOver", newPayload);
      } else
      {
        newPayload.gameMessage = "Sorry, you lost";
        socket.emit("gameOver", newPayload);
      }
    }
  });
});
class Game
{
  constructor(props)
  {
    this.roomName = props.roomName;
    this.players = props.players;
    this.turn = this.players[ 0 ];
    this.lives = props.lives;
    this.difficulty = props.difficulty;
    // this.secretWord = this.handleDifficulty();
    this.secretWord = props.secretWord;
    this.currentWord = props.currentWord;
    this.strLeft = "";
    this.messages = props.message;
  }

  handleDifficulty()
  {
    if (this.difficulty === "easy")
    {
      this.lives = 6;
      this.secretWord = this.getRandomString(5);
    } else if (this.difficulty === "medium")
    {
      this.lives = 4;
      this.secretWord = this.getRandomString(7);
    } else if (this.difficulty === "hard")
    {
      this.lives = 2;
      this.secretWord = this.getRandomString(9);
    }
    this.strLeft = this.secretWord;

    this.makeNewCurrentStr();
  }

  makeNewCurrentStr()
  {
    let word = "";
    for (let i = 0; i < this.secretWord.length; i++)
    {
      word = word.concat("X");
    }
    this.currentWord = word;
  }

  getRandomString(length)
  {
    let str = "";
    do
    {
      str = randomWords({ exactly: 1, maxLength: length })[ 0 ];
      // console.log(str);
    }
    while (str.length !== length);
    return str;
  }

  handleLetterSubmit(letter)
  {
    if (this.strLeft.includes(letter))
    {
      let newWord = this.currentWord;
      let tempStr = this.secretWord;
      // console.log(`newWord ${ newWord }, tempStr ${ tempStr }`);

      while (tempStr.includes(letter))
      {
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

      // console.log(tempStr, newWord);
      this.strLeft = tempStr;
      this.currentWord = newWord;
      return newWord;
    }
    else
    {
      --this.lives;
      let message = `Sorry, the letter ${ letter } is not in the word.`;
      // console.log(message, `You have ${ this.lives } left`);
      return message;
    }
  }
}

server.listen(PORT || 3002, () =>
{
  console.log(`Listening on port: ${ PORT }`);
});
