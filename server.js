const express = require('express');

const apiRouter = require('./api/api-router');

const server = express();

server.use(express.json());
server.use('/api/', apiRouter);

module.exports = server;