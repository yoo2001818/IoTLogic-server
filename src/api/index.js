import Express from 'express';
import middlewares from './middleware';

const router = new Express.Router();
export default router;

router.use(middlewares);
