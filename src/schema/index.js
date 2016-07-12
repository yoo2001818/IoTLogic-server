// This is client's schema: used internally by frontend. If you're looking for
// server's DB schema, you should look /db/index.js instead.

import { Schema } from 'normalizr';

export const User = new Schema('users', {
  idAttribute: entity => {
    if (entity.username) return entity.username.toLowerCase();
    return entity.id;
  }
});

User.define({
});
