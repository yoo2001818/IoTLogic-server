import mkdirp from 'mkdirp';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';

import loggingConfig from '../../../config/log.config';

import Express from 'express';

const router = new Express.Router();
export default router;

// Set up stdout logger
if (loggingConfig.stdout != null) {
  router.use(morgan(loggingConfig.stdout));
}

// Set up access logger
if (loggingConfig.access != null) {
  let options = loggingConfig.access;
  mkdirp.sync(path.resolve(__dirname, '../../', options.directory));
  let stream = fs.createWriteStream(path.resolve(__dirname, '../../',
    options.directory, options.filename));
  router.use(morgan(options.format, {stream}));
}
