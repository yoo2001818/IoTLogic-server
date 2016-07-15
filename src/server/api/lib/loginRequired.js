import errorCode from '../../util/errorCode';

export default function loginRequired(req, res, next) {
  if (req.user == null) {
    res.status(401);
    res.json(errorCode.loginRequired);
    return;
  }
  next();
}
