import expres from 'express';
import { editUser, getSearchUser, getUsername } from '../controllers/user.controller.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';

const userRouter = expres.Router();

userRouter.get('/search', getSearchUser);
userRouter.get('/:username', getUsername);
userRouter.put('/edit-user', AuthMiddleware, editUser );

export default userRouter;