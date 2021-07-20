import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { usersCollection } from '../database';

const userController = new UserController(usersCollection);
const router = Router();

router.get('/', userController.index);
router.get('/:id', userController.indexById);
router.post('/', userController.create);
router.delete('/:id', userController.delete);
router.put('/:id', userController.update);

export { router as userRouter };
