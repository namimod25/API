
import { prisma } from "../db/config.js";
import * as z from 'zod';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';



// const JWT_SECRET = process.env.JWT_SECRET!

export const Register = async (req: Request, res: Response) => {

    try {
        const userSchema = z.object({
            fullname: z.string().min(1, "fullname minimal 1 character"),
            username: z.string().min(2, "username minimal 2 character"),
            email: z.email("email harus berformat jhondoe@mail.com"),
            password: z.string().min(8, "password minimal 8 character"),
        })

        const validasi = userSchema.parse(req.body);
        const exitingEmail = await prisma.user.findUnique({
            where: {
                email: validasi.email
            }
        })
        if (exitingEmail) {
            return res.status(400).json({ message: "email sudah terdaftar" })
        }

        const usernameExiting = await prisma.user.findUnique({
            where: {
                username: validasi.username
            }
        })
        if (usernameExiting) {
            return res.status(400).json({ message: "username sudah terdaftar" })
        }

        
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(validasi.password, salt);

        
        const newUser = await prisma.user.create({
            data: {
                fullname: validasi.fullname,
                username: validasi.username,
                email: validasi.email,
                password: hashedPassword,
                bio: ""
            }
        })

        return res.status(201).json({
            message: "Registrasi berhasil",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        })

    } catch (err) {
        if (err instanceof z.ZodError) {
           const errors = err.issues.map((i) => i.message)
           return res.status(400).json({
            message: errors
           })
        }
        console.error(err);
        return res.status(500).json({ message: "Internal server error" })
    }

}

export const LoginUser =  (req: Request, res: Response) => {

}

export const Logout =  (req: Request, res: Response) => {

}