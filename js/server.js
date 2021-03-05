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

          const activeUsers = db.get('users').find({ status: 'active' }).value();
          response.payload = [activeUsers, user];
          ws.send(JSON.stringify(response));

          usersOnServer.forEach(user => clients[user].send(JSON.stringify(response)));
        }
        break;

      case 'message':
        let message = {
          type: 'message',
          payload: {
            id: payload.id,
            message: payload.message
          }
        }

        db.get('posts').push({ id: message.payload.id, message: message.payload.message }).write();

        // usersOnServer.forEach(user => clients[user].send(JSON.stringify(response)));
        for (const user in clients) {
          clients[user].send(JSON.stringify(message))
        }
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