import Jwt from "jsonwebtoken";
import { prisma } from '../db/config.js'
import type { Request, Response, NextFunction } from "express";



interface UserData {
    id: number,
    fullname: string,
    username: string
    email: string,
    image: string,
    bio: string
}

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const JWT_SECRET = process.env.JWT_SECRET || "";

    try {
        const headers = req.headers.authorization

        if (!headers || typeof headers !== 'string') {
            return res.status(401).json({
                message: "Authorization, Token belum di input"
            })
        }

        const token = headers.split(' ')[1] || "";
        const decoded = Jwt.verify(token, JWT_SECRET) as UserData;

        const currentUser = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        })

        if (!currentUser) {
            return res.status(401).json({ message: "User tidak ditemukan" });
        }

       req.data = {
        id: currentUser.id,
        fullname: currentUser.fullname,
        username: currentUser.username,
        email: currentUser.email,
        Image: currentUser.image,
        bio: currentUser.bio
       };

        next();

    } catch (error) {
        return res.status(401).json({ message: "token tidak benar" })
    }
}