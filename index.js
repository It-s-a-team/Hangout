'use strict';

const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const jwt = require('jsonwebtoken');


const PORT = process.env.PORT || 3002;

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // `origin` is url of front-end
    origin: 'http://localhost:3000',
    methods: [ 'GET', 'POST' ],
  },
});

const hangout = io.of('hangout');
// hangout.use((req) =>
// {
//   console.log(req);
// });

hangout.use((socket, next) =>
{
  if (socket.handshake.auth.token)
  {
    console.log(socket.handshake.auth.token);
    next();
  }
  else
  {
    next(new Error('invalid'));
  }

});
hangout.on('connection', (socket) =>
{
  console.log(`Player Connected: ${ socket.id }`);
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
