import Express from 'express';
import middlewares from './middleware';
import user from './user';

const router = new Express.Router();
export default router;

router.use(middlewares);
router.use(user);
