import express from 'express';
import { followUser, followUserAccount, getLimitUser, unfollowAccount } from '../controllers/follow.controller.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';

const followRouter = express.Router();

followRouter.post('/', AuthMiddleware, followUserAccount);
followRouter.delete('/:unfollow', AuthMiddleware, unfollowAccount);
followRouter.get('/user', AuthMiddleware, getLimitUser);
followRouter.get('/:followId', AuthMiddleware, followUser);

export default followRouter;