'use strict';

const io = require('socket.io-client');

const url = process.env.SERVER_URL || 'http://localhost:3002/hangout';

const socket = io.connect(url);

