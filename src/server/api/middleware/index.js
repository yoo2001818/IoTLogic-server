import bodyParser from 'body-parser';
import session from 'express-session';
import authConfig from '../../../../config/auth.config';
import { sequelize } from '../../db';
import sequelizeStore from 'connect-session-sequelize';
import injectUser from './injectUser';
import expressPromise from 'express-promise';
import Express from 'express';

const SequelizeStore = sequelizeStore(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
  table: 'session'
});

const router = new Express.Router();
export default router;

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(session({
  secret: authConfig.cookieSecret,
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));
router.use(expressPromise());
router.use(injectUser);
