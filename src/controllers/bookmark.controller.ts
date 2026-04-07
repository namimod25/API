import type {Request, Response} from 'express';
import { prisma } from '../db/config.js';


export const BookmarkFeed = async (req: Request, res: Response) => {
    const {postId} = req.params
    const currenUserId = req.data?.id

    if (!currenUserId) {
        return res.status(401).json({message: "Unauthorized"});
    }

    try {
        const postData = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if(!postData){
            return res.status(404).json({
                message: "Post/Feed tidak Di temukan"
            });
        }

        const checkUserBookmark = await prisma.bookmark.findUnique({
            where: {
                userId_postId: {
                    userId: currenUserId,
                    postId: Number(postId)
                }
            }
        })
        if(checkUserBookmark){
            //hapus bookmark
            await prisma.bookmark.delete({
                where: {
                    userId_postId: {
                        userId: currenUserId,
                        postId: Number(postId)
                    }
                }
            })
            return res.status(200).json({message: "Berhasil unsave Bookmark"});
        }

        //buat bookmark
        const Bookmark = await prisma.bookmark.create({
            data: {
                userId: currenUserId,
                postId: Number(postId)
            }
        });

        return res.status(200).json({message: "Berhasil save Bookmark", data: Bookmark});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "internal server", error})
    }
}

export const UserCheckFeed = async (req: Request, res: Response) => {
    try {
        const {postId} = req.params
        const currenUserId = req.data?.id

        if (!currenUserId) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const Ceksaved = await prisma.bookmark.findUnique({
            where:{
                userId_postId: {
                    userId: currenUserId,
                    postId: Number(postId)
                }
            }
        });
        if(Ceksaved){
            return res.status(200).json({data: true});
        }
        return res.status(200).json({data: false});
    } catch (error) {
        console.log(error);

        res.status(500).json({message: "internal server", error});
        
    }
}