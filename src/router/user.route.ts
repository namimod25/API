import expres from 'express';
import { editUser, getSearchUser, getUsername, updateAvatar } from '../controllers/user.controller.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const userRouter = expres.Router();

userRouter.get('/search', getSearchUser);
userRouter.get('/:username', getUsername);
userRouter.put('/edit-user', AuthMiddleware, editUser);
userRouter.put('/upload-photo', AuthMiddleware, upload.single('image'), updateAvatar);

export default userRouter;