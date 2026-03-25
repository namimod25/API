import  expres from 'express'
import { AuthMiddleware } from '../middleware/auth.middleware.js';
import { CheckUserLike, LikeFedd } from '../controllers/like.controller.js';


const LikeRouter = expres.Router();

LikeRouter.post('/:postId', AuthMiddleware, LikeFedd);
LikeRouter.get('/:postId', AuthMiddleware, CheckUserLike);

export default LikeRouter