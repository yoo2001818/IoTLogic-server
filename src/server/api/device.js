import Express from 'express';
import randomstring from 'randomstring';
import loginRequired from './lib/loginRequired';
import handleDBError from './lib/handleDBError';
import errorCode from '../util/errorCode';
import pick from '../util/pick';
import { Device, Document } from '../db';

const router = new Express.Router();
export default router;

function injectConnected(req, device) {
  // This is too long... whatever.
  let clientId = req.app.locals.messageServer.dbClients[device.id];
  return Object.assign({}, device.toJSON(), {
    connected: clientId != null
  });
}

function ensureDevice(req, res, next) {
  if (req.device == null) {
    res.status(404);
    res.json(errorCode.noSuchDevice);
    return;
  }
  next();
}

router.get('/devices', loginRequired, (req, res, next) => {
  req.user.getDevices()
  .then(devices => {
    res.json(devices.map(injectConnected.bind(null, req)));
  }, error => handleDBError(error, req, res, next));
});

router.param('name', (req, res, next, name) => {
  loginRequired(req, res, () => {
    Device.findOne({
      where: {
        userId: req.user.id, name
      },
      include: [ Document ]
    })
    .then(device => {
      if (device != null) {
        req.device = device;
      }
      next();
    }, error => handleDBError(error, req, res, next));
  });
});

router.get('/devices/:name', ensureDevice, (req, res) => {
  // TODO: We should return availability state from message server
  res.json(injectConnected(req, req.device));
});

router.put('/devices/:name', (req, res, next) => {
  let data = pick(req.body, ['name', 'alias', 'type', 'data'], true);
  if (req.device == null) {
    Device.create(Object.assign(data, {
      name: req.params.name,
      userId: req.user.id,
      token: randomstring.generate()
    }))
    .then(device => {
      let token = device.token;
      res.json(Object.assign({}, device.toJSON(), { token, connected: false }));
    }, error => handleDBError(error, req, res, next));
  } else {
    req.device.update(data)
    .then(device => {
      res.json(injectConnected(req, device));
    }, error => handleDBError(error, req, res, next));
    // TODO: Notify the connected device (if exists)
  }
});

router.post('/devices/:name/token', ensureDevice, (req, res, next) => {
  req.device.update({
    token: randomstring.generate()
  })
  .then(device => {
    let token = device.token;
    res.json(Object.assign({}, injectConnected(req, device), { token }));
  }, error => handleDBError(error, req, res, next));
});

router.delete('/devices/:name', ensureDevice, (req, res, next) => {
  // TODO: Disconnect the target device
  req.device.destroy()
  .then(() => res.json({}), error => handleDBError(error, req, res, next));
});
