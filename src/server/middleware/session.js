import session from 'express-session';
import authConfig from '../../../config/auth.config';
import { sequelize } from '../db';
import sequelizeStore from 'connect-session-sequelize';

const SequelizeStore = sequelizeStore(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
  table: 'session'
});

export default session({
  secret: authConfig.cookieSecret,
  resave: false,
  saveUninitialized: false,
  store: sessionStore
});
