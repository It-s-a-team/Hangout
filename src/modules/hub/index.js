'use strict';

// Create a Constant that will carry the "Socket.io" NPM package
// Create a Constant that will carry the arrays in the "eventPool"
// Create a Constant that will carry the Port
const io = require('socket.io');
const eventPool = require('./eventPool');
const PORT = process.env.PORT || 3002;
const randomWords = require('random-words');

// Create a Constant that will carry the io Server
// The "Server" is now listening for a player to Log-in.
const server = io(PORT);
// Creating a Constant named randomWord that will create a random word with random-words.
//const randomWord = new random-words();
const hangout = server.of('/hangout');
console.log(`Server is listening on port: ${ PORT }/hangout`);

hangout.on('connection', (socket) =>
{
  console.log(`New Player connected!!!`, socket.id);

  // select random word from wordArray based of difficulty user picked
  // set player turn

  socket.on('gameStart', (payload) =>
  {
    payload = {
      turn: 'player1',
      lives,
      currentWord: currentWord,
    };

    socket.emit('gameStart', payload);
  });

  socket.on('letterSubmit', (payload) =>
  {
    console.log(payload);
    handleLetterSubmit(payload);
  });
});

function getRandomString(length)
{
  let str = '';
  do
  {
    str = randomWords({ exactly: 1, maxLength: length })[ 0 ];
    console.log(str);
  } while (str.length !== length);
  return str;
}

let secretString = getRandomString(5);
console.log(secretString);
let currentWord = 'XXXXX';
let strLeft = secretString;
let lives = 3;

function handleLetterSubmit(letter)
{
  console.log('handleLetter', letter);

  if (strLeft.includes(letter))
  {
    let newWord = currentWord;
    let tempStr = secretString;

    while (tempStr.includes(letter))
    {
      let index = tempStr.indexOf(letter);
      // let index2 = newWord.indexOf(letter);
      tempStr =
        tempStr.substring(0, index) +
        'X' +
        tempStr.substring(index + 1, tempStr.length);

      newWord =
        newWord.substring(0, index) +
        letter +
        newWord.substring(index + 1, currentWord.length);
    }

    console.log(tempStr, newWord);
    strLeft = tempStr;
    currentWord = newWord;
    return newWord;
  }
  else
  {
    --lives;
    let message = 'Sorry, no letter in word';
    console.log(message, `You have ${ lives } left`);
    return message;
  }
}
