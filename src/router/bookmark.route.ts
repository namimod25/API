import express from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware.js';
import { BookmarkFeed, UserCheckFeed } from '../controllers/bookmark.controller.js';

const BookmarkRouter = express.Router();

BookmarkRouter.post('/:postId', AuthMiddleware, BookmarkFeed);
BookmarkRouter.get('/:postId', AuthMiddleware, UserCheckFeed);

export default BookmarkRouter