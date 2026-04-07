import type {Response, Request} from 'express'
import { prisma } from '../db/config.js'



export const LikeFedd = async (req: Request, res: Response) => {

    const currentUserId = req.data?.id
    const {postId} = req.params

    if (currentUserId === undefined) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const postData = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        });
        if(!postData){
            return res.status(404).json({message: "post/feed tidak di temukan"});
        }
        //cek jika user sudah like
        const CheckLike = await prisma.likes.findUnique({
            where: {
                userId_postId: {
                    userId: currentUserId,
                    postId: Number(postId)
                },
            }
        });

        if(CheckLike){
            return res.status(400).json({
                message: "Anda sudah memberikan like ke post ini"
            })
        }

        const newLike = await prisma.likes.create({
            data:{
                userId: currentUserId,
                postId: Number(postId)
            }
        });
        //update
        await prisma.post.update({
            where:{
                id: Number(postId)
            },
            data:{
                likeCount: {increment: 1}
            }
        });
        res.status(201).json({message: "Anda telah memberikan like",
            data: newLike
        });

    } catch (error) {
        console.log(error);
        
        res.status(500).json({message: "internal server",
            error
        });
    }
}


export const CheckUserLike = async (req: Request, res: Response) => {
    const {postId} = req.params
    const currentUserId = req.data?.id

    if (currentUserId === undefined) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const postData = await prisma.post.findUnique({
            where:{
                id: Number(postId)
            }
        })

        if(!postData){
            return  res.status(404).json({
                message: "anda belum like post/feed tersebut"
            })
        }

        const CheckLike = await prisma.likes.findUnique({
            where:{
                userId_postId: {
                    userId: currentUserId,
                    postId: Number(postId)
                }
            }
        });

        if(CheckLike){
            await prisma.likes.delete({
                where:{
                    userId_postId: {
                        userId: currentUserId,
                        postId: Number(postId)
                    }
                }
            })

            await prisma.post.update({
                where: {id: Number(postId)},
                data: {
                    likeCount: {decrement: 1}
                }
            })
            return res.status(200).json({message: "Unlike Berhasil"});

        }
        return res.status(200).json({
            data: false
        })

    } catch (error) {
         return res.status(500).json({
                message:"internal server", error
            })
    }
}