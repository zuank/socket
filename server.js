const express = require('express');
const app = express();

const port = process.env.PORT || 1234;

app.use(express.static('static'));

const server = app.listen(port, () => {
  console.log(`technode is on port ${port} |`);
});

const io = require('socket.io').listen(server);

io.sockets.on('connection', (socket) => {
  console.log(1)
  socket.on('set nickname', (name) => {
    console.log(2)
    socket.nickname = name;
    socket.broadcast.emit('new user', {
      nickname: name,
      type: 'user',
    });
    console.log(3)
    socket.emit('login', {
      nickname: name,
      id: socket.id,
    });
  });
  socket.on('new dialog', (str) => {
    io.emit('new dialog', {
      value: str,
      nickname: socket.nickname,
      type: 'dialog',
    });
  });
});
