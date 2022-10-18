'use strict';

//Required URL's, NPM packages, and servers

const io = require('socket.io-client');
const eventPool = require('./eventPool.js');
const PORT = process.env.PORT || 3002;
const server = io(PORT);

