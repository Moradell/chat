const ws = new WebSocket('ws://localhost:5501');

const body = document.querySelector('body');
const sendButton = document.getElementById('sendButton');
const nameForm = document.getElementById('form');
const burger = document.getElementById('burger');
const modal = document.getElementById('modal');
const closeModalButton = document.getElementById('closeModal');

nameForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const loginScreen = document.getElementById('login');
  const inputName = document.getElementById('name').value;

  loginScreen.style.display = 'none';
  burger.style.display = 'block';

  const request = {
    type: 'login',
    payload: {
      login: inputName
    }
  }

  ws.send(JSON.stringify(request));
});

sendButton.addEventListener('click', function (event) {
  event.preventDefault();

  const inputMessage = document.getElementById('inputMessage');
  const inputMessageValue = inputMessage.value;

  const request = {
    type: 'message',
    payload: {
      text: inputMessageValue
    }
  }

  ws.send(JSON.stringify(request));
  inputMessage.value = '';
});

burger.addEventListener('click', function () {
  burger.classList.toggle('burger--active');

  if (burger.classList.contains('burger--active')) {
    modal.classList.add('open');
  } else {
    modal.classList.remove('open');
  }
});

body.addEventListener('click', function (event) {
  if (event.target.id == 'modal') {
    modal.classList.remove('open');
    burger.classList.remove('burger--active');
  }
});

closeModalButton.addEventListener('click', function (e) {
  e.preventDefault();
  modal.classList.remove('open');
  burger.classList.remove('burger--active');
});

ws.onopen = function () {
  console.log('Hello');
}

ws.onmessage = function (message) {
  const response = JSON.parse(message.data);

  const { payload } = response;

  switch (response.type) {
    case 'login':
      addUsers(payload);
      break;

    case 'newLogin':
      newUser(payload);
      addUsers(payload);
      break;

    case 'message':

      break;
  }
};

// window.addEventListener('beforeunload', function () {

// });

function addUsers({ login }) {
  const ul = document.getElementById('userList');
  const li = document.createElement('li');
  const photoBlock = document.createElement('div');
  const photoImg = document.createElement('img');
  const userContent = document.createElement('div');
  const userName = document.createElement('div');
  const userMessage = document.createElement('div');

  li.classList.add('users-list__item');
  photoBlock.classList.add('users-list__photo');
  photoImg.src = './img/ellipse.png';
  userContent.classList.add('users-list__content');
  userName.classList.add('users-list__name');
  userMessage.classList.add('users-list__last-message');

  userName.innerText = login;
  userMessage.innerText = 'Какое-то последнее сообщение';

  photoBlock.append(photoImg);
  userContent.append(userName, userMessage);
  li.append(photoBlock, userContent);
  ul.append(li);
}

function newUser({ login }) {
  const chat = document.getElementById('messageList');
  const li = document.createElement('li');
  li.innerText = `Пользователь ${login} вошел в чат`;
  chat.appendChild(li);
}