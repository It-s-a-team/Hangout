'use strict';

const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

// import the auth0 functionality
const verifyUser = require('./modules/auth/auth');


const PORT = process.env.PORT || 3002;

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // `origin` is url of front-end
    origin: `${process.env.CLIENT_ORIGIN}` || 'http://localhost:3000',
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
hangout.on('connection', (socket) =>
{
  console.log(`Player Connected:  ${ socket.id}`);
  socket.on('hello', (payload) =>
  {
    console.log('payload: ', payload);
    console.log('this player\'s id: ', socket.id);
  });

  // put game code here
});

server.listen(PORT || 3002, () =>
{
  console.log(`Listening on port: ${ PORT }`);
});
