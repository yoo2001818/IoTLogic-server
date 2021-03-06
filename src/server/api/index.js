import Express from 'express';
import middlewares from './middleware';
import user from './user';
import device from './device';
import document from './document';

const router = new Express.Router();
export default router;

router.use(middlewares);
router.use(user);
router.use(device);
router.use(document);
