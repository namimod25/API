
import { prisma } from "../db/config.js";
import * as z from 'zod';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import Jwt from "jsonwebtoken";





export const Register = async (req: Request, res: Response) => {
    console.log("Register Body:", req.body);


    try {
        const userSchema = z.object({
            fullname: z.string().min(1, "fullname minimal 1 character"),
            username: z.string().min(2, "username minimal 2 character"),
            email: z.string().email("email harus berformat jhondoe@mail.com"),
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
        const jwtSecret = process.env.JWT_SECRET
        if (!jwtSecret) {
            return res.status(500).json({ message: "verifikasi token gagal" });
        }
        const token = Jwt.sign({ id: newUser.id }, jwtSecret, { expiresIn: '1d' });

        return res.status(201).json({
            message: "Registrasi berhasil",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                bio: newUser.bio
            },
            token: token
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

export const LoginUser = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email dan password harus di tulis" });
        }
        const exitingEmail = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (!exitingEmail) {
            return res.status(400).json({ message: "Email belum Terdaftar" });
        }
        const ComparePassword = bcrypt.compareSync(password, exitingEmail.password)

        if (!ComparePassword) {
            return res.status(400).json({ message: "invalid user" });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ message: "JWT secret not configured" });
        }

        const token = Jwt.sign({ id: exitingEmail.id }, jwtSecret, { expiresIn: '1d' });

        return res.status(200).json({
            message: "Login berhasil", token,
            data: {
                id: exitingEmail.id,
                fullname: exitingEmail.fullname,
                Image: exitingEmail.image,
                bio: exitingEmail.bio
            }
        });
    } catch (error) {
        res.status(500).json({ message: "internal server" });
    }
}

export const GetUser = async (req: Request, res: Response) => {
    res.status(200).json({
        message: "Berhasil mendapatkan data",
        data: (req as any).data
    })
}

export const Logout = (req: Request, res: Response) => {

}