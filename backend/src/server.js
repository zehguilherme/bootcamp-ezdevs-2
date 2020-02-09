const express = require('express');
require('express-async-errors');

require('dotenv/config')
const Youch = require('youch');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const server = require('http').Server(app);

const io = require('socket.io')(server);
const routes = require('./routes');

const connectedUsers = {};
io.on('connect', (socket) => {
    const { user } = socket.handshake.query;

    connectedUsers[user] = socket.id;
})

mongoose.connect(process.env.URI_MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;
    return next();
})

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(async (err, req, res, next) => {
    const { error: { message } } = await new Youch(err, req).toJSON();
    res.status(400).json({message});
})

server.listen(process.env.PORT, () => {
    console.log(`Running on port ${process.env.PORT}`);
});