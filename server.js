const WebSocket = require('ws');
const fs = require('fs');
const uuidv1 = require('uuidv1');

const wss = new WebSocket.Server({
  port: 5501
});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const request = JSON.parse(message);

    switch (request.type) {
      case 'message':
        const response = {
          type: 'message',
          payload: {
            text: request.payload.text
          }
        }
        ws.send(JSON.stringify(response));
        break;

      case 'name':
        const response = {
          type: 'name',
          payload: {
            id: uuidv1(),
            name: request.payload.text
          }
        }

        ws.send(JSON.stringify(response));
        break;

      default: console.log('Что-то пошло не так');
        break;
    }
  }

  );

  ws.send('something');
}

);

wss.on('close', function () { }

);