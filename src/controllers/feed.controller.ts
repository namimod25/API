import type {Response, Request} from 'express';
import cloudinary from '../utils/cloudinary.js';
import { prisma } from '../db/config.js';


export const CreateFeed = async (req: Request, res: Response) => {
    try {
        const {caption} = req.body
        const currentUserId = req.data?.id
        if(!caption){
            return res.status(400).json({message: "caption wajib diisi"});
        }

        if(!req.file){
            return res.status(400).json({message: "file gambar belum diinput"})
        }

        if (!currentUserId) {
            return res.status(401).json({message: "User tidak terautentikasi"});
        }

        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
        
                const result = await cloudinary.uploader.upload(fileStr, {
                    folder: 'feeds',
                    transformation: [
                        {aspect_ratio: '4:5', crop: 'fill', gravity: "auto",},
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
                res.status(201).json({message: "Feed berhasil dibuat", data: newFeed});
    } catch (error) {
        console.log(error);
        
        res.status(500).json({message: "Internal server",
            error});
    }
}

export const ReadAllFeeds = async(req: Request, res: Response) => {
    try {
        const currentUserId = req.data?.id

        if (!currentUserId) {
            return res.status(401).json({message: "User tidak terautentikasi"});
        }

        //request query
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit

        const totalFeed = await prisma.post.count()

        const posts = await prisma.post.findMany(
            {
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
            orderBy: { 
                createdAt: 'desc'
            },
            skip: skip,
            take: limit
        })

        res.status(200).json({
            message: "Feeds berhasil diambil",
            data: posts,
            pagination: {
                page,
                limit,
                total: totalFeed,
                totalPages: Math.ceil(totalFeed / limit)
            }
        });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({message: "Internal server error", error});
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
            },
            comments: {
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    user: {
                        select:{id: true, username: true, image: true}
                    }
                },
                orderBy: {createdAt: 'desc'}
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
    try {
        const { id } = req.params
        const postData = await prisma.post.findUnique({
            where: {
                id: Number(id)
            }
        })
        if (!postData) {
            return res.status(404).json({ message: "Feed tidak di temukan" });
        }
        if (postData.userId !== Number(req.data?.id)) {
            return res.status(400).json({ message: "anda tidak bisa menghapus feed user lain" });
        }

        if (postData.imageId) {
            await cloudinary.uploader.destroy(postData.imageId)
        }

        await prisma.$transaction(async (tx) => {
            console.log(`[deleteFeed] Manual cleanup for post ${id}...`);
            // Manually delete related records to avoid foreign key constraint errors
            const dLikes = await tx.likes.deleteMany({ where: { postId: Number(id) } });
            const dComments = await tx.comment.deleteMany({ where: { postId: Number(id) } });
            const dBookmarks = await tx.bookmark.deleteMany({ where: { postId: Number(id) } });
            
            console.log(`[deleteFeed] Cleanup stats for post ${id}: Likes=${dLikes.count}, Comments=${dComments.count}, Bookmarks=${dBookmarks.count}`);

            console.log(`[deleteFeed] Deleting post ${id}...`);
            await tx.post.delete({
                where: {
                    id: Number(id)
                }
            });
        });

        console.log(`[deleteFeed] Successfully deleted feed ${id}`);
        return res.status(200).json({ message: "data feed berhasil di hapus" });
    } catch (error: any) {
        console.error("[deleteFeed] ERROR:", error);
        return res.status(500).json({ 
            message: "Internal server error", 
            error: error.message || "Unknown error" 
        });
    }
}