import express from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware.js';
import { commentDeleteId, createComment } from '../controllers/comment.controller.js';

const routeComment = express();

routeComment.post('/', AuthMiddleware, createComment);
routeComment.delete('/:id', AuthMiddleware, commentDeleteId);
export default routeComment;