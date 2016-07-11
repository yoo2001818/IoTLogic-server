import http from 'http';
import express from 'express';
import MessageServer from './messageServer';

import networkConfig from '../config/network.config';

const httpServer = http.createServer();
const messageServer = new MessageServer(httpServer);
const app = express();

app.all('/', (req, res) => {
  res.send('IoTLogic central messaging server');
});

httpServer.on('request', app);
httpServer.listen(networkConfig.port, networkConfig.listen, () => {
  console.log('Listening on port ' + networkConfig.port);
});

console.log(messageServer);
