import  expres from 'express'
import { AuthMiddleware } from '../middleware/auth.middleware.js';
import { LikeFedd } from '../controllers/like.controller.js';


const LikeRouter = expres.Router();

LikeRouter.post('/:postId', AuthMiddleware, LikeFedd);


export default LikeRouter