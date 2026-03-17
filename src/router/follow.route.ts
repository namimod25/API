import express from 'express';
import { followUserAccount } from '../controllers/follow.controller.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';

const followRouter = express.Router();

followRouter.post('/', AuthMiddleware, followUserAccount);

export default followRouter;