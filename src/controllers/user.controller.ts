import type {Request, Response} from 'express';
import { prisma } from '../db/config.js';



export const getUsername = async (req: Request, res: Response) => {
    const username = req.params['username'] as string

    try {
        const user = await prisma.user.findUnique({
            where: {
                username
            },
            omit:{
                password: true,
                imageId: true
            }
        })

        if(!user){
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
    
    if(!username){
        return res.status(400).json({message: "query username belum di Isi" });
    }
    
    const users = await prisma.user.findMany({
        where:{
            username: {
                contains: username,
                mode: "insensitive"
            },
        },
        select:{
            id: true,
            username: true,
            fullname: true,
            image: true
        }
    })

    if(users.length === 0){
         return res.status(404).json({message: "username tidak ditemukan" });
    }
    res.status(200).json({
        message: "Cari user",
        data: users
    })
}