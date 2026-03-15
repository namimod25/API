import express from 'express';
import { LoginUser, Register } from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/register', Register);
router.post('/login', LoginUser);
export default router;