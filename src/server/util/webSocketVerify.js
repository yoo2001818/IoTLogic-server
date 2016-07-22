import { Device } from '../db';
import session from '../middleware/session';
const debug = require('debug')('IoTLogic:webSocketVerify');

export default function verifyClient(info, cb) {
  let token = info.req.url.slice(1);
  debug('A client connected with token ' + token);
  if (token === 'notifications') {
    // This is for a push notification; check session.
    session(info.req, {}, function(){
      console.log(info.req.session);
      cb(false, 500, 'Internal server error');
    });
  }
  Device.findOne({ where: { token } })
  .then(device => {
    if (device == null) {
      debug('Unknown token (Unauthorized)');
      cb(false, 401, 'Unauthorized');
      return;
    }
    info.req.device = device;
    cb(true);
  }, error => {
    debug('Token loading failed');
    console.log(error);
    cb(false, 500, 'Internal server error');
  });
}
