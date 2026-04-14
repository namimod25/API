import type {Request, Response} from 'express';
import { prisma } from '../db/config.js';


export const createComment = async (req: Request, res: Response) => {
    try {
        const currentUserId = req.data?.id
        const { postId, content}  = req.body

        if (currentUserId === undefined) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        if(!postId || !content){
            return res.status(400).json({
                message: "Input Post dan content wajib di isi"
            });
        }

        const postData = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })
        if(!postData){
            return res.status(404).json({message: "post/feed tidak di temukan"})
        }
        //masukan data
       const  newContent =  await prisma.comment.create({
            data:{
                userId: currentUserId,
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
    } catch (error: any) {
        console.error("[createComment] ERROR:", error);
        res.status(500).json({ 
            message: 'Internal server error', 
            error: error.message || 'Unknown error'
        })
    }
}

export const commentDeleteId = async (req: Request, res: Response) => {
    try {
        console.log(`[commentDeleteId] Attempting to delete comment. id: ${req.params?.id}, userId: ${req.data?.id}`);
        const { id } = req.params;
        const currentUserId = req.data?.id;

        if (!currentUserId) {
            console.warn("[commentDeleteId] Unauthorized: currentUserId is missing");
            return res.status(401).json({ message: "Unauthorized: Data user tidak ditemukan" })
        }

        const commentId = Number(id);
        if (isNaN(commentId)) {
            console.warn(`[commentDeleteId] Invalid ID format: ${id}`);
            return res.status(400).json({ message: "ID komentar tidak valid" });
        }

        const comment = await prisma.comment.findUnique({
            where: {
                id: commentId
            }
        });

        if (!comment) {
            console.warn(`[commentDeleteId] Comment not found: ${commentId}`);
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId !== currentUserId) {
            console.warn(`[commentDeleteId] Forbidden: User ${currentUserId} tried to delete comment ${commentId} owned by ${comment.userId}`);
            return res.status(403).json({ message: "Anda tidak bisa menghapus komentar user lain" });
        }

        await prisma.$transaction(async (tx) => {
            console.log(`[commentDeleteId] Deleting comment ${commentId}...`);
            await tx.comment.delete({
                where: {
                    id: commentId
                }
            });

            console.log(`[commentDeleteId] Decrementing comment count for post ${comment.postId}...`);
            await tx.post.update({
                where: {
                    id: Number(comment.postId)
                },
                data: {
                    commentCount: { decrement: 1 }
                }
            });
        });

        console.log(`[commentDeleteId] Successfully deleted comment ${commentId}`);
        res.status(200).json({ message: "komentar telah terhapus" });
    } catch (error: any) {
        console.error("[commentDeleteId] ERROR:", error);
        res.status(500).json({ 
            message: 'Internal server error', 
            error: error.message || 'Unknown error'
        })
    }
}
