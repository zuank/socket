const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT || 1234;

app.use(express.static(path.join(__dirname, '/static')));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, './static/index.html'));
});

const server = app.listen(port, () => {
  console.log(`technode is on port ${port} |`);
});

const io = require('socket.io').listen(server);

io.sockets.on('connection', (socket) => {
  socket.on('set nickname', (name) => {
    socket.nickname = name;
    socket.broadcast.emit('new user', {
      nickname: name,
      type: 'user',
    });
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
