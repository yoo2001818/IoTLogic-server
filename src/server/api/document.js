import Express from 'express';
import loginRequired from './lib/loginRequired';
import handleDBError from './lib/handleDBError';
import errorCode from '../util/errorCode';
import { Device, Document, User, DeviceDocumentLink } from '../db';
import pick from '../util/pick';

function resolveDevices(req, res, next) {
  let devices;
  let input = req.body.devices;
  if (Array.isArray(input)) {
    devices = input;
  } else if (typeof input === 'string') {
    devices = input.split(',');
  } else {
    req.devices = null;
    next();
    return;
  }
  return Device.findAll({
    where: {
      name: {
        $in: devices
      },
      userId: req.user.id
    }
  })
  .then(models => {
    // Check if each device exists..
    let output = devices.map(name => models.find(model => model.name === name));
    if (output.some(device => device == null)) {
      res.status(400);
      res.json(Object.assign({}, errorCode.noSuchDevice, {
        name: devices[0]
      }));
      return;
    }
    output.forEach((device, position) => device.deviceDocumentLink = {
      position
    });
    req.devices = output;
    next();
  })
  .catch(error => handleDBError(error, req, res, next));
}

function ensureOwnership(req, res, next) {
  loginRequired(req, res, () => {
    if (req.user.id !== req.document.userId) {
      res.status(403);
      res.json(errorCode.forbidden);
      return;
    }
    next();
  });
}

function stripDevices(data, isJSON = false) {
  let json = isJSON ? data : data.toJSON();
  let devicesJSON = json.devices.slice() || [];
  devicesJSON.sort((a, b) => {
    return a.deviceDocumentLink.position - b.deviceDocumentLink.position;
  });
  let obj = Object.assign({}, json, {
    devices: devicesJSON.map(v => ({
      id: v.id,
      name: v.name
    })),
    user: json.user && {
      id: json.user.id,
      username: json.user.username
    },
  });
  delete obj.deviceDocumentLink;
  return obj;
}

const router = new Express.Router();
export default router;

router.get('/documents', loginRequired, (req, res) => {
  res.json(req.user.getDocuments({
    attributes: {
      exclude: ['payload', 'payloadTemp', 'createdAt', 'updatedAt', 'userId']
    }
  }));
});

router.post('/documents', loginRequired, resolveDevices, (req, res, next) => {
  let data = pick(req.body, ['name', 'payload', 'visibility', 'state'], true);
  data.userId = req.user.id;
  Document.create(data)
  .then(document => {
    return document.setDevices(req.devices || [])
    .then(() => {
      document.devices = req.devices || [];
      req.app.locals.messageServer.addDocument(document);
      res.json(stripDevices(document));
    });
  }).catch(error => handleDBError(error, req, res, next));
});

router.param('id', (req, res, next, id) => {
  Document.findById(id, {
    include: [ Device, User ]
  })
  .then(doc => {
    if (doc == null) {
      res.status(404);
      res.json(errorCode.noSuchDocument);
      return;
    }
    req.document = doc;
    if (doc.visibility !== 'public') {
      loginRequired(req, res, () => {
        if (req.user.id !== doc.userId) {
          res.status(403);
          res.json(errorCode.forbidden);
          return;
        }
        next();
      });
    } else {
      // We have to strip device information, if possible.
      next();
    }
  }, error => handleDBError(error, req, res, next));
});

router.get('/documents/:id', (req, res) => {
  res.json(stripDevices(req.document));
});

router.post('/documents/:id', ensureOwnership, resolveDevices,
(req, res, next) => {
  let data = pick(req.body, ['name', 'payload', 'visibility', 'state'], true);
  req.document.update(data)
  .then(document => {
    if (req.devices != null) {
      return document.setDevices(req.devices)
      .then(() => {
        return Object.assign({}, document.toJSON(), {
          devices: req.devices || []
        });
      });
    } else {
      return document.toJSON();
    }
  }).then(document => {
    req.app.locals.messageServer.updateDocument(document);
    res.json(stripDevices(document, true));
  }).catch(error => handleDBError(error, req, res, next));
});

router.delete('/documents/:id', ensureOwnership, (req, res, next) => {
  req.document.destroy()
  .then(() => {
    req.app.locals.messageServer.destroyDocument(req.document);
    res.json(Object.assign({}, stripDevices(req.document), {
      deleted: true
    }));
  }).catch(error => handleDBError(error, req, res, next));
});

router.get('/documents/:id/payload', (req, res) => {
  res.type('text/plain');
  res.attachment(req.document.name + '.scm');
  res.send(req.document.payload);
});

router.post('/documents/:id/payload', ensureOwnership, (req, res, next) => {
  let payload;
  if (req.body.payload) {
    payload = req.body.payload;
  } else {
    payload = req.document.payloadTemp;
    if (payload == null) {
      res.type('text/plain');
      res.send(payload);
      return;
    }
  }
  req.document.update({ payload, payloadTemp: null })
  .then(() => {
    req.app.locals.messageServer.updateDocument(req.document);
    res.type('text/plain');
    res.send(payload);
  }).catch(error => handleDBError(error, req, res, next));
});

router.get('/documents/:id/workspace', (req, res) => {
  res.type('text/plain');
  res.attachment(req.document.name + '.scm');
  if (req.document.payloadTemp) {
    res.send(req.document.payloadTemp);
    return;
  }
  res.send(req.document.payload);
});

router.post('/documents/:id/workspace', ensureOwnership, (req, res) => {
  res.json(req.document.update({ payloadTemp: req.body.payload })
  .then(() => ({})));
});

router.delete('/documents/:id/workspace', ensureOwnership, (req, res, next) => {
  req.document.update({ payloadTemp: null })
  .then(() => {
    res.type('text/plain');
    res.send(req.document.payload);
  }).catch(error => handleDBError(error, req, res, next));
});
