const WebSocket = require('ws');
const fs = require('fs');
const uuidv1 = require('uuidv1');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ posts: [], users: [], avatar: [] }).write();

const wss = new WebSocket.Server({
  port: 5501
});

let clients = {};

wss.on('connection', function connection(ws) {
  const userId = uuidv1();
  ws.on('message', function incoming(message) {
    const request = JSON.parse(message);
    const { payload } = request;

    switch (request.type) {
      case 'login':
        const user = {
          id: userId,
          login: payload.login,
          status: 'active'
        };

        const previousUser = db.get('users').find({ login: payload.login }).value();
        if (!previousUser) {
          clients[userId] = ws;
          db.get('users').push(user).write();
        } else {
          // чекаем posts и avatar
        }

        const usersOnServer = Object.keys(clients).filter((user) => user !== userId);

        let response = {
          type: 'login',
          payload: null
        };

        if (usersOnServer.length === 0) {
          response.payload = user;
          ws.send(JSON.stringify(response));
        } else {
          response = {
            type: 'newLogin',
            payload: user
          };

          // ws.send(--------- о чем я ------------------)
          // ws.send(JSON.stringify(response));


          usersOnServer.forEach(user => clients[user].send(JSON.stringify(response)));
        }
        break;

      case 'name':
        response = {
          type: 'name',
          payload: {
            id: uuidv1(),
            name: request.payload.text
          }
        }

        db.get('posts')
          .push({ id: response.payload.id, name: response.payload.name })
          .write()

        ws.send(JSON.stringify(response));
        break;

      default: console.log('Что-то пошло не так');
        break;
    }
  }

  );
}

);

wss.on('close', function () { }

);