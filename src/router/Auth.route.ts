import express from 'express';
import { GetUser, LoginUser, Register } from '../controllers/auth.controller.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';
const router = express.Router();

router.post('/register', Register);
router.post('/login', LoginUser);
router.get('/me', AuthMiddleware, GetUser);

export default router;