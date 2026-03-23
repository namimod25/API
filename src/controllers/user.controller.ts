import type { Request, Response } from 'express';
import { prisma } from '../db/config.js';
import * as z from 'zod';
import cloudinary from '../utils/cloudinary.js';



export const getUsername = async (req: Request, res: Response) => {
    const username = req.params['username'] as string

    try {
        const user = await prisma.user.findUnique({
            where: {
                username
            },
            omit: {
                password: true,
                imageId: true
            }
        })

        if (!user) {
            return res.status(404).json({
                message: "User Tidak Ditemukan"
            });
        }
        res.status(200).json({
            message: "Detail User",
            data: user

        })
    } catch (error) {
        return res.status(500).json({
            message: "maslah server"
        });
    }
}

export const getSearchUser = async (req: Request, res: Response) => {
    const username = req.query.username as string

    if (!username) {
        return res.status(400).json({ message: "query username belum di Isi" });
    }

    const users = await prisma.user.findMany({
        where: {
            username: {
                contains: username,
                mode: "insensitive"
            },
        },
        select: {
            id: true,
            username: true,
            fullname: true,
            image: true
        }
    })

    if (users.length === 0) {
        return res.status(404).json({ message: "username tidak ditemukan" });
    }
    res.status(200).json({
        message: "Cari user",
        data: users
    })
}
export const editUser = async (req: Request, res: Response) => {
    try {
        const userSchema = z.object({
            fullname: z.string().min(1, "fullname minimal 1 character"),
            username: z.string().min(2, "username minimal 2 character"),
            bio: z.string().min(10, "isi biodata kamu"),
        })
        const validasi = userSchema.parse(req.body);

        const userId = req.data.id

        const updateUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                ...validasi
            },
            select: {
                id: true,
                fullname: true,
                username: true,
                bio: true
            }
        });

        return res.status(200).json({
            message: "User telah berhasil memperbarui",
            data: updateUser
        });

    } catch (err) {
        if (err instanceof z.ZodError) {
            const errors = err.issues.map((i) => i.message)
            return res.status(400).json({
                message: errors
            })
        }
        console.error(err);
        res.status(500).json({ message: "internal server" });
    }
}

export const updateAvatar = async (req: Request, res: Response) => {
    try {
        if(!req.file){
            return res.status(400).json({message: "belum ada gambar yang diupload"});
        }

        const userId = req.data.id

        const currentUser = await prisma.user.findUnique({
            where:{
                id: userId
            }
        });
        if(currentUser?.imageId){
            await cloudinary.uploader.destroy(currentUser.imageId)
        }
        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`

        const result = await cloudinary.uploader.upload(fileStr, {
            folder: 'avatar',
            transformation: [{
                width: 300,
                height: 300
            }]
        })

        const updateUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                image: result.secure_url,
                imageId: result.public_id
            },
            omit:{
                password: true
            }
        })
        return res.status(201).json({message: "Update image profile berhasil",
            data: updateUser
        })
    } catch (error) {
        console.log(error);
        
        res.status(500).json({message: "internal server",
            error
        })
    }
}
