'use strict';

const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const randomWords = require("random-words");
let newGame = null;
// import the auth0 functionality
const verifyUser = require('./modules/auth/auth');


const PORT = process.env.PORT || 3002;

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // `origin` is url of front-end
    origin: `${ process.env.CLIENT_ORIGIN }` || 'http://localhost:3000',
    methods: [ 'GET', 'POST' ],
  },
});
// log to see if the 'cors' object above is as intended
// console.log(io.engine);
// hangout namespace on our instance of 'io'
const hangout = io.of('hangout');


// function to verify the integrity of the token and grant authorization to move on to join a room
hangout.use((socket, next) =>
{
  // console.log('we made it in hangout.use');

  // if there is an auth token in our socket.io handshake object from the front-end
  if (socket.handshake.auth.token)
  {
    // log to test if user's token is the same as the one on the front-end
    // console.log(socket.handshake.auth.token);

    // call the `verifyUser` function in the `auth.js` file
    // this function accepts the user's token and a callback(for errors) as parameters
    verifyUser(socket.handshake.auth.token, async (err, user) =>
    {
      // error first, approach
      if (err)
      {
        console.log(err);
        next(new Error('token not valid'));
      }
      else
      {
        next();
      }
    });
  }
  else
  {
    next(new Error('invalid'));
  }
});

// as soon as the client's token is verified, the `.next()` will send them here and let the client connect
hangout.on("connection", (socket) =>
{
  console.log(`New Player connected!!!`, socket.id);

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
    console.log(newGame);
    // payload = {
    //   turn: newGame.turn,
    //   lives: newGame.lives,
    //   currentWord: newGame.currentWord,
    // };
    console.log("startgame payload", newPayload);
    console.log("game started");

    socket.emit("gameStart", newPayload);
  });

  socket.on("join", (payload) =>
  {
    console.log("join", payload);

    socket.join(payload);
    hangout.emit("newRoom", "1234");
  });

  socket.on("testing", (payload) => console.log(payload));

  socket.on("chat", (message) =>
  {
    console.log(message);
    hangout.to("1234").emit("chat", message);
    // hangout.emit("chat", message);
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
    console.log("I'm Here", newGame.currentWord);
    console.log(anyX);
    if (anyX === true && newGame.lives > 0)
    {
      newPayload.gameMessage = response;
      socket.emit("nextTurn", newPayload);
    } else
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
    } while (str.length !== length);
    return str;
  }

  handleLetterSubmit(letter)
  {
    console.log("handleLetter", letter);

    if (this.strLeft.includes(letter))
    {
      let newWord = this.currentWord;
      let tempStr = this.secretWord;
      console.log(`newWord ${ newWord }, tempStr ${ tempStr }`);

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

      console.log(tempStr, newWord);
      this.strLeft = tempStr;
      this.currentWord = newWord;
      return newWord;
    } else
    {
      --this.lives;
      let message = "Sorry, no letter in word";
      console.log(message, `You have ${ this.lives } left`);
      return message;
    }
  }
}

// let newGame = new Game({
//   roomName: "1234",
//   players: ["player1", "player2"],
//   difficulty: "medium",
// });
// newGame.handleDifficulty();

// console.log(newGame);

server.listen(PORT || 3002, () =>
{
  console.log(`Listening on port: ${ PORT }`);
});
