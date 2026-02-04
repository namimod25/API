import express  from "express";
import { editPasswordByToken, editUserByToken, getProfile, getUsers, LoginUser, Logout, Register, uploadAvatar } from "../controllers/auth.controllers";
import { isAuth } from "@/middleware/AuthMiddleware";
import upload from "@/middleware/uploadMiddleware";

const authRouter = express.Router()

authRouter.post('/register', Register)
authRouter.post('/login', LoginUser)
authRouter.post('/logout', isAuth, Logout)
authRouter.get('/profile', isAuth, getProfile)
authRouter.get('/users', isAuth, getUsers)
authRouter.post('/upload', isAuth, upload.single('avatar'), uploadAvatar)
authRouter.put('/edit', isAuth, editUserByToken)
authRouter.put('/edit-password', isAuth, editPasswordByToken)

export default authRouter