const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
const axios = require('axios');
const crypto = require('crypto');

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


io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
    console.log(msg);
  });
});

server.listen(3000, () => {
  console.log('running')
});
