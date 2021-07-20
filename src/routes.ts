import { Router } from 'express';
import { userRouter } from './routers/userRouter';

const router = Router();

router.use('/users', userRouter);

export { router };
