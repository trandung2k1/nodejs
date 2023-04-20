const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('./db.json');
const middleware = jsonServer.defaults();
server.use(middleware);
server.use(router);
server.use(cors());
module.exports = server;
