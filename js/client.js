const ws = new WebSocket('ws://localhost:5501');

const body = document.querySelector('body');
const sendButton = document.getElementById('sendButton');
const nameForm = document.getElementById('form');
const burger = document.getElementById('burger');
const modal = document.getElementById('modal');
const closeModalButton = document.getElementById('closeModal');
const userPageId = document.getElementById('userId');
const photoPrev = document.getElementById('photoPrev');
const modalPhotoPrev = document.getElementById('preview-modal');
const canselButton = document.getElementById('canselButton');
const saveButton = document.getElementById('saveButton');
const zoneForDrop = document.getElementById('zoneForDrop');

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
      id: userPageId.innerText,
      message: inputMessageValue
    }
  }

  ws.send(JSON.stringify(request));
  inputMessage.value = '';
});

ws.onopen = function () {
  console.log('Hello');
};

ws.onmessage = function (message) {
  const response = JSON.parse(message.data);

  const { payload } = response;

  switch (response.type) {
    case 'login':
      addUsers(payload);
      userPageId.innerText = payload.id;
      break;

    case 'newLogin':
      const lastUser = payload.length - 1;
      newUser(payload[lastUser].login);
      clearUsers();
      for (const user of payload) {
        addUsers(user);
      }
      break;

    case 'message':
      newMessage(payload.message);
      break;

    case 'avatarReload':
      reloadAvatars();
      break;
  }
};

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
  photoImg.classList.add('user-photo');
  userContent.classList.add('users-list__content');
  userName.classList.add('users-list__name');
  userMessage.classList.add('users-list__last-message');

  userName.innerText = login;
  userMessage.innerText = 'Какое-то последнее сообщение';

  photoBlock.append(photoImg);
  userContent.append(userName, userMessage);
  li.append(photoBlock, userContent);
  ul.append(li);
};

function newUser(login) {
  const chat = document.getElementById('messageList');
  const li = document.createElement('li');
  li.innerText = `Пользователь ${login} вошел в чат`;
  chat.appendChild(li);
};

function newMessage(message) {
  const chat = document.getElementById('messageList');
  const li = document.createElement('li');
  li.innerText = message;
  chat.appendChild(li);
};

function reloadAvatars() {
  const reAvatar = document.getElementById('reAvatar').src;
  const avatar = document.querySelector('.user-photo');
  avatar.src = reAvatar;
};

function clearUsers() {
  const userList = document.getElementById('userList');
  while (userList.firstChild) {
    userList.removeChild(userList.firstChild);
  }
};

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

photoPrev.addEventListener('click', function (event) {
  event.preventDefault();

  document.getElementById('reAvatar').src = './img/no-photo.png';
  modal.classList.remove('open');
  burger.style.display = 'none';
  modalPhotoPrev.classList.add('openned');
});

canselButton.addEventListener('click', function (event) {
  event.preventDefault();

  modalPhotoPrev.classList.remove('openned');
  burger.style.display = 'block';
  burger.classList.remove('burger--active');
});

saveButton.addEventListener('click', function (event) {
  event.preventDefault();
  const avatarSource = document.getElementById('reAvatar').src;

  const request = {
    type: 'avatar',
    payload: {
      id: userPageId.innerText,
      src: avatarSource
    }
  }
  ws.send(JSON.stringify(request));

  modalPhotoPrev.classList.remove('openned');
  burger.style.display = 'block';
  burger.classList.remove('burger--active');

});

zoneForDrop.addEventListener('dragover', function dragOverEvent(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
});

zoneForDrop.addEventListener('drop', function dropEvent(event) {
  event.preventDefault();
  const photos = event.dataTransfer.files;
  reforgeInBase64(photos[0])
    .then(
      data => {
        document.getElementById('reAvatar').src = data;
      }
    );
});

function reforgeInBase64(photo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(photo);
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });
};

// window.addEventListener('beforeunload', function () {
// });