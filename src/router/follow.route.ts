import express from 'express';
import { followUserAccount, unfollowAccount } from '../controllers/follow.controller.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';

const followRouter = express.Router();

followRouter.post('/', AuthMiddleware, followUserAccount);
followRouter.delete('/:unfollow', AuthMiddleware, unfollowAccount);

export default followRouter;