const button_send = document.getElementById('send');
const button = document.getElementById('button');
const dashboard = document.getElementById('dashboard');
let chat_box = document.getElementById('chat-box');
var data = {};

const client = io();

client.on('connect', socket => {
  data.id = client.id;
});

client.on('chat message', msg => {
  let comment = document.createElement('div');
  let gravatar = document.createElement('a');
  let image = document.createElement('img');
  let content = document.createElement('div');
  let author = document.createElement('a');
  let text = document.createElement('p');

  // add className
  comment.className += ' comment';
  gravatar.className = 'avatar';
  content.className = 'content';
  author.className = 'author';
  text.className = 'text';

  // set src
  image.setAttribute('src', msg.gravatar);

  // add text
  author.innerHTML = msg.username;
  text.innerHTML = msg.text;

  // add appendChild
  gravatar.appendChild(image);

  content.appendChild(author);
  content.appendChild(text);

  comment.appendChild(gravatar);
  comment.appendChild(content);

  chat_box.appendChild(comment);
});

button.addEventListener('click', async (event) => {
  const username = document.getElementById('username');

  let card = document.getElementById('card');
  let loading = document.getElementById('loading');
  let gravatar = document.getElementById('gravatar');
  let username_info = document.getElementById('username_info');
  let id_ = document.getElementById('id_');
  let response = await axios({
    method: 'GET',
    url: `/gravatar?username=${username.value}`
  });

  card.style.display = "none";
  loading.style.display = "";

  setTimeout(() => {
    loading.style.display = "none";
    dashboard.style.display = ""

    gravatar.setAttribute('src', response.data.gravatar);
    username_info.innerHTML = username.value;
    id_.innerHTML = data.id;
    data.username = username.value;
    data.gravatar = response.data.gravatar;
  }, 500);
});

button_send.addEventListener('click', async (event) => {
  const message = document.getElementById('message').value;

  client.emit('chat message', {
    gravatar: data.gravatar,
    text: message,
    id: data.id,
    username: data.username
  });
});
