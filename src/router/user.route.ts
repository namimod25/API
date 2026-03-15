import expres from 'express';
import { getSearchUser, getUsername } from '../controllers/user.controller.js';

const userRouter = expres.Router();

userRouter.get('/search', getSearchUser);
userRouter.get('/:username', getUsername);

export default userRouter;