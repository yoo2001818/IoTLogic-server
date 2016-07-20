import http from 'http';
import express from 'express';
import MessageServer from './messageServer';

import apiRouter from './api';
import logging from './util/logging';
import errorCode from './util/errorCode';
import serveStatic from 'serve-static';

import networkConfig from '../../config/network.config';

const production = process.env.NODE_ENV === 'production';

const httpServer = http.createServer();
const messageServer = new MessageServer(httpServer);
const app = express();

app.set('x-powered-by', false);
app.locals.messageServer = messageServer;

app.use(logging);
app.use('/api', apiRouter);

if (__DEVELOPMENT__) {
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpack = require('webpack');
  const webpackConfig = require('../../webpack.config.js');
  let compiler = webpack(webpackConfig);
  app.use(webpackHotMiddleware(compiler));
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: '/assets'
  }));
} else {
  app.use('/assets', serveStatic('./dist'));
}

app.get('/favicon.ico', (req, res) => {
  res.sendStatus(404);
});

app.use('/doc', serveStatic('./doc-dist'));

app.use((req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta charset="UTF-8">
        <title>IoTLogic</title>
      </head>
      <body>
        <script src="/assets/bundle.js"></script>
      </body>
    </html>
  `);
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
