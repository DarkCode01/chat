const button = document.getElementById('button');
const dashboard = document.getElementById('dashboard');
var data = {};

const client = io();

client.on('connect', socket => {
  data.id = client.id;

  client.emit('thing', data.id, 'asdasd');
});

client.on('joined users', users => {
  let feed = document.getElementById('feed');
  feed.className = 'ui feed';
  let modals = document.getElementById('modals');
  // remove data
  _removeChild(feed);

  for (let user in users) {
    if (user != data.username) {
      feed.append(createItemuser(user, users[user]));
      modals.append(createModal(user, users[user]));
    }
  }
});

client.on('chat message', msg => {
  let chat_box = document.getElementById('chat-box');
  let item = document.createElement('div');
  let gravatar = document.createElement('a');
  let image = document.createElement('img');
  let content = document.createElement('div');
  let author = document.createElement('a');
  let text = document.createElement('p');

  // add className
  item.className = ' item';
  gravatar.className = 'ui tiny image';
  content.className = 'content';
  author.className = 'header';
  text.className = 'description';

  // set src
  image.setAttribute('src', msg.gravatar);

  // add text
  author.innerHTML = msg.username;
  text.innerHTML = msg.text;

  // add appendChild
  gravatar.appendChild(image);

  content.appendChild(author);
  content.appendChild(text);

  item.appendChild(gravatar);
  item.appendChild(content);

  chat_box.appendChild(item);
});

client.on('me', msg => {
  console.log(msg);
})


button.addEventListener('click', async (event) => {
  const username = document.getElementById('username');

  let chat = document.getElementById('chat-normal')
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
    chat.append(createChat());
    var button_send = document.getElementById('send');
    button_send.onclick = sendMessage;
    loading.style.display = "none";
    dashboard.style.display = ""

    gravatar.setAttribute('src', response.data.gravatar);
    username_info.innerHTML = username.value;
    data.username = username.value;
    data.gravatar = response.data.gravatar;

    client.emit('join user', {
      username: data.username,
      gravatar: data.gravatar
    });
  }, 500);
});

function sendMessage(event) {
  const message = document.getElementById('message').value;

  client.emit('chat message', {
    gravatar: data.gravatar,
    text: message,
    id: data.id,
    username: data.username
  });
};


function _removeChild(node) {
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }
}

function createChat(private = false) {
  let chat = document.createElement('div');
  let header = document.createElement('div');
  let divider = document.createElement('div');
  let messages = document.createElement('div');
  let _form = document.createElement('div');
  let form = document.createElement('div');
  let field = document.createElement('div');
  let textarea = document.createElement('textarea');
  let button = document.createElement('button');

  // styles and class
  divider.className = 'ui divider';
  chat.className = 'ui segment';
  chat.style.width = '805px';
  header.className = 'ui centered huge header';
  messages.className = 'ui items';
  messages.setAttribute('id', private ? 'chat-private' : 'chat-box');
  messages.style.height = '400px';
  messages.style['overflow-y'] = 'auto';
  _form.className = private ? '_form_private' : '_form';
  form.className = 'ui form';
  field.className = 'field';
  textarea.setAttribute('id', private ? 'message_private' : 'message');
  button.className = 'ui button';
  button.setAttribute('id', private ? 'send_private' : 'send');

  // add content
  button.append('Enviar Mensaje');
  header.append('Chat');
  field.appendChild(textarea);
  form.appendChild(field);
  form.appendChild(button);
  _form.appendChild(form);
  chat.appendChild(header);
  chat.appendChild(divider);
  chat.appendChild(messages);
  chat.appendChild(divider);
  chat.appendChild(_form);

  return chat;
}

function createModal(user, data) {
  let modal = document.createElement('div');
  let icon = document.createElement('i');
  let header = document.createElement('div');
  let content = document.createElement('div');
  let description = document.createElement('div');
  let actions = document.createElement('div');
  let close = document.createElement('div');
  let chat = createChat(true);

  modal.className = `ui modal ${user}`;
  icon.className = 'close icon';
  header.className = 'header';
  header.append(`Chat ${user}`);
  description.className = 'description';
  content.className = 'content';
  content.append();
  actions.className = 'actions';
  close.className = 'ui black deny button';
  send.className = 'ui right labeled icon button';

  close.append('Cerrar');
  description.appendChild(chat);
  content.appendChild(description);
  actions.appendChild(close);
  modal.appendChild(icon);
  modal.appendChild(header);
  modal.appendChild(content);
  modal.appendChild(actions);

  return modal;
}

function createItemuser(user, data) {
  let _event = document.createElement('div');
  let image = document.createElement('img');
  let label = document.createElement('div');
  let content = document.createElement('div');
  let summary = document.createElement('div');
  let _user = document.createElement('a');
  let date = document.createElement('div');
  let icon = document.createElement('i');
  let divider = document.createElement('div');

  // className
  _event.className = 'event';
  label.className = 'label';
  content.className = 'content';
  summary.className = 'summary';
  _user.className = `user header`;
  date.className = 'date';
  icon.className = 'icon green circle';
  divider.className = 'ui divider';

  image.setAttribute('src', data.gravatar);
  _user.setAttribute('id', user);
  _user.append(user);
  _user.addEventListener('click', (event) => {
    $(`.${event.target.id}`)
      .modal('show');
  });
  date.append(icon);

  // makup
  label.appendChild(image);
  summary.appendChild(_user);
  summary.appendChild(date);
  content.appendChild(summary);
  _event.appendChild(label);
  _event.appendChild(content);

  return _event;
}
