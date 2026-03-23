import type {Response, Request} from 'express';
import cloudinary from '../utils/cloudinary.js';
import { prisma } from '../db/config.js';


export const CreateFeed = async (req: Request, res: Response) => {
    try {
        const {caption} = req.body
        const currentUserId = req.data.id
        if(!caption){
            return res.status(400).json({message: "caption wajib di isi"});
        }

        if(!req.file){
            return res.status(400).json({message: "file gambar belum di input"})
        }

        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
        
                const result = await cloudinary.uploader.upload(fileStr, {
                    folder: 'feeds',
                    transformation: [
                        {aspecy_ratio: '4:5', crop: 'fill', gravity: "auto",},
                        {quality: "auto", fetch_format: "auto"}
                    ],
                })

                const newFeed = await prisma.post.create({
                    data: {
                        caption,
                        image: result.secure_url,
                        imageId: result.public_id,
                        userId: currentUserId
                    }
                })
                //update data
                await prisma.user.update({
                    where: {
                        id: Number(currentUserId)
                    },
                    data: {
                        postCount: {increment: 1}
                    }
                })
                res.status(201).json({message: "Feed berhasil di buat", data: newFeed});
    } catch (error) {
        console.log(error);
        
        res.status(500).json({message: "Internal server",
            error});
    }
}

export const ReadAllFeeds = async(req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    fullname: true,
                    username: true,
                    image: true,
                },
            },
        },
            orderBy: { createdAt: 'desc',},
    });

    res.status(200).json({message: 'get all feeds', data: posts});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "internal serber", error});
    }
}

export const detailFeed = async (req: Request, res: Response) => {
    const {id} = req.params
    try {
        const post = await prisma.post.findUnique({
            where: {
            id: Number(id)
        },
        include: {
            user: {
                select: {
                    id: true,
                    fullname: true,
                    username: true,
                    image: true
                }
            }
        }
    });

    if(!post){
        return res.status(404).json({
            message: "Post tidak di temukan"
        })
    }
    res.status(200).json({message: "Get detail Feed", data: post});

    } catch (error) {
        res.status(500).json({message: "internal server", error});
    }
}

export const deleteFeed = async (req: Request, res: Response) => {

    const {id} = req.params
    const postData = await prisma.post.findUnique({
        where: {
            id: Number(id)
        }
    })
    if(!postData){
        return res.status(404).json({message: "Feed tidak di temukan"});
    }
    if (postData.userId != (req.data.id)) {
        res.status(400).json({message: "anda tidak bisa menghapus feed user lain"});
    }

    if(postData.imageId){
        await cloudinary.uploader.destroy(postData.imageId)
    }
    await prisma.post.delete({
        where: {
            id: Number(id)
        }
    });
    return res.status(200).json({message: "data feed berhasil di hapus"});
}