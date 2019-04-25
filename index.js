const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
const axios = require('axios');
const crypto = require('crypto');

var users = {};

app.use(express.static('semantic'));

app.get('/', async (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/gravatar', async (req, res) => {
  const hash = crypto
    .createHash('md5')
    .update(req.query.username || 'null')
    .digest("hex");

  res.json({
    gravatar: `https://www.gravatar.com/avatar/${hash}?d=retro`
  });
});

app.get('/private', async (req, res) => {
  const username = req.query.u;


  res
    .json({
      error: 'nNot Found!'
    })
});

io.on('connection', (socket) => {

  socket.on('thing', (id, msg) => {
    io.to(socket.id).emit('me', id);
  });

  socket.on('join user', data => {
    users[data.username] = {
      id: socket.id,
      gravatar: data.gravatar
    };

    io.emit('joined users', users);
  });

  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', reason => {
    let username = null;

    for (let user in users) {
        if (users[user].id == socket.id) {
          username = user;
          break;
        }
    }

    delete users[username];
    io.emit('joined users', users);
  });
});

server.listen(3000, () => {
  console.log('running')
});
