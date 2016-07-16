import Express from 'express';
import loginRequired from './lib/loginRequired';
import handleDBError from './lib/handleDBError';
import errorCode from '../util/errorCode';
import { Device, Document, User } from '../db';
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
    models.forEach(model => {
      let index = devices.indexOf(model.name);
      if (index === -1) throw new Error('Unknown device returned');
      devices.splice(index, 1);
    });
    if (devices.length > 0) {
      res.status(400);
      res.json(Object.assign({}, errorCode.noSuchDevice, {
        name: devices[0]
      }));
    }
    req.devices = models;
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

function stripDevices(data) {
  let json = data.toJSON();
  return Object.assign({}, json, {
    devices: (json.devices || []).map(v => ({
      id: v.id,
      name: v.name
    })),
    user: json.user && {
      id: json.user.id,
      username: json.user.username
    }
  });
}

const router = new Express.Router();
export default router;

router.get('/documents', loginRequired, (req, res) => {
  res.json(req.user.getDocuments({
    include: [ Device ]
  })
  .then(v => v.map(stripDevices)));
});

router.post('/documents', loginRequired, resolveDevices, (req, res, next) => {
  let data = pick(req.body, ['name', 'payload', 'visibility', 'state'], true);
  data.userId = req.user.id;
  Document.create(data)
  .then(document => {
    return document.setDevices(req.devices || [])
    .then(() => {
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
      return document;
    }
  }).then(document => {
    // TODO: We should notify the message server to use the document
    // (if it's turned on)
    res.json(stripDevices(document));
  }).catch(error => handleDBError(error, req, res, next));
});

router.delete('/documents/:id', ensureOwnership, (req, res, next) => {
  req.document.destroy()
  .then(() => {
    // TODO: Notify message server
    res.json({});
  }).catch(error => handleDBError(error, req, res, next));
});

router.get('/documents/:id/payload', (req, res) => {
  res.json(req.document.payload);
});

router.post('/documents/:id/payload', ensureOwnership, (req, res) => {
  let payload;
  if (req.body.payload) {
    payload = req.body.payload;
  } else {
    payload = req.document.payloadTemp;
    if (payload == null) {
      res.json({});
      return;
    }
  }
  res.json(req.document.update({ payload, payloadTemp: null })
  .then(() => ({})));
  // TODO: Notify message server
});

router.get('/documents/:id/workspace', (req, res) => {
  if (req.document.payloadTemp) {
    res.json(req.document.payloadTemp);
    return;
  }
  res.json(req.document.payload);
});

router.post('/documents/:id/workspace', ensureOwnership, (req, res) => {
  res.json(req.document.update({ payloadTemp: req.body.payload })
  .then(() => ({})));
});

router.delete('/documents/:id/workspace', ensureOwnership, (req, res) => {
  res.json(req.document.update({ payloadTemp: null })
  .then(() => ({})));
});
