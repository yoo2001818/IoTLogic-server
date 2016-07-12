import { User } from '../../db';

function setUser(user) {
  this.user = user;
  this.session.userId = user.id;
}

export default function injectUser(req, res, next) {
  req.setUser = setUser;
  if (req.session.userId != null) {
    User.findById(req.session.userId)
    .then(user => {
      req.user = user;
      next();
    }, e => {
      next(e);
    });
  } else {
    next();
  }
}
