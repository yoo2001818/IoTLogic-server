import Express from 'express';
import bcrypt from 'bcryptjs';
import loginRequired from './lib/loginRequired';
import handleDBError from './lib/handleDBError';
import errorCode from '../util/errorCode';
import { User } from '../db';
import { Password } from '../validation/schema';
import { validateSingle } from '../validation/validate';

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

  let passwordError = validateSingle({ password: password || '' }, Password);
  if (passwordError) {
    res.status(400);
    return res.json(Object.assign({}, errorCode.validation, passwordError));
  }
  // Validation will be done by Sequelize ORM, so we don't have do anything else
  bcrypt.hash(password, 8, function (err, hash) {
    if (err) return next(err);
    // Create the user
    User.create({ username, name, email, hash })
    .then(user => {
      req.setUser(user);
      res.json(user);
    }, error => handleDBError(error, req, res, next));
  });
});
