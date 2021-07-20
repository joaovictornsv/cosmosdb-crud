import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const userController = new UserController();
const router = Router();

router.get('/', userController.index);
router.get('/:id', userController.indexById);
router.post('/', userController.create);
router.delete('/:id', userController.delete);
router.put('/:id', userController.update);

export { router as userRouter };
