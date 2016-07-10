import http from 'http';
import express from 'express';
import MessageServer from './messageServer';

const httpServer = http.createServer();
const messageServer = new MessageServer(httpServer);
const app = express();

app.all('/', (req, res) => {
  res.send('IoTLogic central messaging server');
});

httpServer.on('request', app);
httpServer.listen(23482, () => {
  console.log('Listening on port ' + 23482);
});

console.log(messageServer);
