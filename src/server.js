'use strict';

const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const PORT = process.env.PORT || 3002;

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001' || 'http://localhost:3002',
    methods: ['GET', 'POST'],
  },
});

const hangout = io.of('hangout');

hangout.on('connection', (socket) =>
{
  console.log('Player Connected: ${socket.id}');
});

server.listen(PORT || 3002, () =>
{
  console.log(`Listening on port: ${PORT}`);
});
