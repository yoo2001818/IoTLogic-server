import Express from 'express';
import randomstring from 'randomstring';
import loginRequired from './lib/loginRequired';
import handleDBError from './lib/handleDBError';
import errorCode from '../util/errorCode';
import pick from '../util/pick';
import { Device } from '../db';

const router = new Express.Router();
export default router;

router.get('/devices', loginRequired, (req, res) => {
  // TODO: We should return availability state from message server
  res.json(req.user.getDevices());
});

router.param('name', (req, res, next, name) => {
  loginRequired(req, res, () => {
    Device.findOne({
      where: {
        userId: req.user.id, name
      }
    })
    .then(device => {
      if (device != null) {
        req.device = device;
      }
      next();
    }, error => handleDBError(error, req, res, next));
  });
});

function ensureDevice(req, res, next) {
  if (req.device == null) {
    res.status(404);
    res.json(errorCode.noSuchDevice);
    return;
  }
  next();
}

router.get('/devices/:name', ensureDevice, (req, res) => {
  // TODO: We should return availability state from message server
  res.json(req.device);
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
      res.json(Object.assign({}, device.toJSON(), { token }));
    }, error => handleDBError(error, req, res, next));
  } else {
    res.json(req.device.update(data));
    // TODO: Notify the connected device (if exists)
  }
});

router.post('/devices/:name/token', ensureDevice, (req, res, next) => {
  req.device.update({
    token: randomstring.generate()
  })
  .then(device => {
    let token = device.token;
    res.json(Object.assign({}, device.toJSON(), { token }));
  }, error => handleDBError(error, req, res, next));
});

router.delete('/devices/:name', ensureDevice, (req, res, next) => {
  // TODO: Disconnect the target device
  req.device.destroy()
  .then(() => res.json({}), error => handleDBError(error, req, res, next));
});
