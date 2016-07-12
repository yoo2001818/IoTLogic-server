import http from 'http';
import express from 'express';
import MessageServer from './messageServer';

import apiRouter from './api';
import logging from './util/logging';
import errorCode from './util/errorCode';

import networkConfig from '../config/network.config';

const production = process.env.NODE_ENV === 'production';

const httpServer = http.createServer();
const messageServer = new MessageServer(httpServer);
const app = express();

app.use(logging);
app.use('/api', apiRouter);

app.all('/', (req, res) => {
  res.send('IoTLogic central messaging server');
});

app.use(function(err, req, res, next) { // eslint-disable-line
  console.error(err.stack);
  if (!production) {
    res.status(500).json(Object.assign({}, errorCode.internalError, {
      message: err.stack
    }));
  } else {
    res.status(500).json(errorCode.internalError);
  }
});

httpServer.on('request', app);
httpServer.listen(networkConfig.port, networkConfig.listen, () => {
  console.log('Listening on port ' + networkConfig.port);
});

console.log(messageServer);
