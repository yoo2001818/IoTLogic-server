import Express from 'express';
import bcrypt from 'bcryptjs';
import loginRequired from './lib/loginRequired';
import handleDBError from './lib/handleDBError';
import errorCode from '../util/errorCode';
import { User } from '../db';
import { Password } from '../../validation/schema';
import { validateSingle } from '../../validation/validate';

const router = new Express.Router();
export default router;

router.route('/user')
.get(loginRequired, (req, res) => {
  // Quick question: Why are we hiding the email address anyway?
  const { email } = req.user;
  res.json(Object.assign({}, req.user.toJSON(), {
    email
  }));
})
.post(loginRequired, (req, res, next) => {
  const { name, email } = req.body;
  let updates = {};
  if (name) updates.name = name;
  if (email) updates.email = email;
  req.user.update(updates)
  .then(user => {
    const { email } = user;
    res.json(Object.assign({}, user.toJSON(), {
      email
    }));
  }, error => handleDBError(error, req, res, next));
})
.delete(loginRequired, (req, res) => {
  req.setUser(null);
  res.json({});
});

router.post('/user/register', (req, res, next) => {
  if (req.user != null) {
    res.status(400);
    return res.json(errorCode.alreadyLoggedIn);
  }
  const { username, name, email, password } = req.body;

  let passwordError = validateSingle({ password: password || '' },
    { password: Password });
  if (passwordError) {
    res.status(400);
    return res.json(Object.assign({}, errorCode.validation, passwordError));
  }
  // Validation will be done by Sequelize ORM, so we don't have do anything else
  bcrypt.hash(password, 8, (err, hash) => {
    if (err) return next(err);
    // Create the user
    User.create({ username, name, email, password: hash })
    .then(user => {
      req.setUser(user);
      res.json(user);
    }, error => handleDBError(error, req, res, next));
  });
});

router.post('/user/login', (req, res, next) => {
  if (req.user != null) {
    res.status(400);
    return res.json(errorCode.alreadyLoggedIn);
  }
  const { username, password } = req.body;

  User.findOne({ where: { username } })
  .then(user => {
    if (user == null) {
      res.status(401);
      return res.json(errorCode.invalidUsername);
    }
    bcrypt.compare(password || '', user.password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        res.status(401);
        return res.json(errorCode.invalidPassword);
      }
      // All done!
      req.setUser(user);
      res.json(user);
    });
  }, error => handleDBError(error, req, res, next));
});

router.post('/user/password', (req, res, next) => {
  const { password, newPassword } = req.body;
  bcrypt.compare(password || '', req.user.password, (err, result) => {
    if (err) return next(err);
    if (!result) {
      res.status(401);
      return res.json(errorCode.invalidPassword);
    }
    let passwordError = validateSingle({ newPassword: newPassword || '' },
      { newPassword: Password });
    if (passwordError) {
      res.status(400);
      return res.json(Object.assign({}, errorCode.validation, passwordError));
    }
    bcrypt.hash(newPassword, 8, (err, hash) => {
      if (err) return next(err);
      req.user.update({ password: hash })
      .then(user => {
        res.json(user);
      }, error => handleDBError(error, req, res, next));
    });
  });
});
