import type {Response, Request} from 'express';
import cloudinary from '../utils/cloudinary.js';
import { prisma } from '../db/config.js';


export const CreateFeed = async (req: Request, res: Response) => {
    try {
        const {caption} = req.body
        const currentUserId = (req as any).data.id
        if(!caption){
            return res.status(400).json({message: "caption wajib di isi"});
        }

        if(!req.file){
            return res.status(400).json({message: "file gambar belum di input"})
        }

        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
        
                const result = await cloudinary.uploader.upload(fileStr, {
                    folder: 'feeds',
                    transformation: [{
                        width: 1080,
                        height: 1080,
                        crop: 'fill',
                        gravity: 'auto'
                    },
                    {
                        quality: 'auto',
                        fetch_format: 'auto'
                    }],
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