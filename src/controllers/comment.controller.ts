import type {Request, Response} from 'express';
import { prisma } from '../db/config.js';


export const createComment = async (req: Request, res: Response) => {
    try {
        const currentUser = req.data?.id
        const { postId, content}  = req.body

        if(!postId || !content){
            res.status(400).json({
                message: "Input Post dan content wajib di isi"
            });
        }

        const postData = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })
        if(!postData){
            return res.status(400).json({message: "post/feed tidak di temukan"})
        }
        //masukan data
       const  newContent =  await prisma.comment.create({
            data:{
                userId: Number(currentUser),
                postId: Number(postId),
                content
            }
        });
        //update post count
        await prisma.post.update({
            where:{
                id: Number(postId)
            },
            data: {
                commentCount: {increment: 1}
            }
        });
        res.status(201).json({message: "comment berhasil",
            data: newContent
        })
    } catch (error) {
        res.status(500).json({message: 'internal server',
            error
        })
    }
}

export const commentDeleteId = async (req: Request, res: Response) => {
    const {id} = req.params
    const currentUser = req.body.id

    const comment = await prisma.comment.findUnique({
        where:{
            id: Number(id)
        }
    })

    if(!comment){
        return res.status(404).json({message: "Comment not found"});
    }

    if(comment.userId != currentUser){
        return res.status(400).json({message: "Anda tidak bisa menghapus komentar user lain"});
    }

    await prisma.comment.delete({
        where: {
            id: Number(id)
        }
    });

    await prisma.post.update({
        where: {
            id: Number(comment.postId)
        },
        data: {
            commentCount: {decrement: 1}
        }
    })

    res.status(200).json({message: "commen telah terhapus"});
}