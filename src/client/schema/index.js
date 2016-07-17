// This is client's schema: used internally by frontend. If you're looking for
// server's DB schema, you should look /db/index.js instead.

import { Schema, arrayOf } from 'normalizr';

export const User = new Schema('users', {
  idAttribute: entity => {
    if (entity.username) return entity.username.toLowerCase();
    return entity.id;
  }
});

export const Device = new Schema('devices', {
  idAttribute: device => {
    if (device.name) return device.name;
    return device.id;
  }
});

export const Document = new Schema('documents');

User.define({
});

Device.define({
  documents: arrayOf(Document)
});

Document.define({
  user: User,
  devices: arrayOf(Device)
});
