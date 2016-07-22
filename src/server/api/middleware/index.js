import bodyParser from 'body-parser';
import injectUser from './injectUser';
import expressPromise from 'express-promise';
import session from '../../middleware/session';
import Express from 'express';

const router = new Express.Router();
export default router;

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(session);
router.use(expressPromise());
router.use(injectUser);
