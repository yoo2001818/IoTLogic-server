import Express from 'express';
import randomstring from 'randomstring';
import loginRequired from './lib/loginRequired';
import handleDBError from './lib/handleDBError';
import errorCode from '../util/errorCode';
import pick from '../util/pick';
import pseudoDevices from '../device';
import { trigger } from '../device/webRemote';
import { Device, Document } from '../db';

const router = new Express.Router();
export default router;

function stripAssociation(document) {
  let json = Object.assign({}, document);
  delete json.deviceDocumentLink;
  return json;
}

function injectConnected(req, device) {
  let json = device.toJSON();
  if (pseudoDevices[json.type] != null) {
    return Object.assign({}, json,
      req.app.locals.messageServer.getDeviceStats(device), {
        pseudo: true,
        documents: json.documents && json.documents.map(stripAssociation)
      });
  }
  return Object.assign({}, json,
    req.app.locals.messageServer.getDeviceStats(device), {
      documents: json.documents && json.documents.map(stripAssociation)
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
  req.user.getDevices({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'userId', 'data']
    }
  })
  .then(devices => {
    res.json(devices.map(injectConnected.bind(null, req)));
  }, error => handleDBError(error, req, res, next));
});

router.post('/devices/', loginRequired, (req, res, next) => {
  let data = pick(req.body, ['name', 'alias', 'type', 'data'], true);
  if (data.data !== undefined) data.data = JSON.stringify(data.data);
  Device.create(Object.assign(data, {
    userId: req.user.id,
    token: randomstring.generate()
  }))
  .then(device => {
    if (pseudoDevices[device.type] != null) {
      res.json(Object.assign({}, device.toJSON(), { documents: [],
        pseudo: true }));
      return;
    }
    let token = device.token;
    res.json(Object.assign({}, device.toJSON(), {
      token, connected: false, documents: [] }));
  }, error => handleDBError(error, req, res, next));
});

router.param('name', (req, res, next, name) => {
  loginRequired(req, res, () => {
    Device.findOne({
      where: {
        userId: req.user.id, name
      },
      include: [{
        model: Document,
        attributes: {
          exclude: ['payload', 'payloadTemp', 'createdAt', 'updatedAt',
            'userId']
        }
      }]
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
  res.json(injectConnected(req, req.device));
});

router.post('/devices/:name', ensureDevice, (req, res, next) => {
  let data = pick(req.body, ['name', 'alias', 'data'], true);
  if (data.data !== undefined) data.data = JSON.stringify(data.data);
  req.device.update(data)
  .then(device => {
    req.app.locals.messageServer.updateDevice(device);
    res.json(injectConnected(req, device));
  }, error => handleDBError(error, req, res, next));
});

router.post('/devices/:name/token', ensureDevice, (req, res, next) => {
  if (pseudoDevices[req.device.type] != null) {
    res.status(403);
    res.json(errorCode.pseudoDeviceToken);
    return;
  }
  req.device.update({
    token: randomstring.generate()
  })
  .then(device => {
    let token = device.token;
    res.json(Object.assign({}, injectConnected(req, device), { token }));
  }, error => handleDBError(error, req, res, next));
});

router.delete('/devices/:name', ensureDevice, (req, res, next) => {
  req.device.destroy()
  .then(() => {
    req.app.locals.messageServer.destroyDevice(req.device);
    res.json(Object.assign({}, req.device.toJSON(), {
      deleted: true
    }));
  }, error => handleDBError(error, req, res, next));
});

// Web Remote specific part

function ensureWebRemote(req, res, next) {
  if (req.device.type !== 'webRemote') {
    res.status(403);
    res.json(errorCode.forbidden);
    return;
  }
  next();
}

router.get('/devices/:name/remote', ensureDevice, ensureWebRemote,
(req, res) => {
  res.json(
    (req.app.locals.messageServer.getDeviceStats(req.device) || {}).remote);
});

router.post('/devices/:name/remote/:group/:id', ensureDevice, ensureWebRemote,
(req, res) => {
  let stats = req.app.locals.messageServer.getDeviceStats(req.device);
  if (stats.remote == null) throw new Error('Remote is null');
  if (stats.remote[req.params.group] == null) {
    res.status(404);
    res.json(errorCode.noSuchGroup);
    return;
  }
  if (stats.remote[req.params.group][req.params.id] == null) {
    res.status(404);
    res.json(errorCode.noSuchEntry);
    return;
  }
  let component = stats.remote[req.params.group][req.params.id];
  if (component.type !== 'button') {
    res.status(400);
    res.json(errorCode.notButton);
  }
  // Trigger the button....
  trigger(req.device.id, req.params.group, req.params.id);
  res.json({});
});
