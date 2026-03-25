import type {Response, Request} from 'express'
import { prisma } from '../db/config.js';



export const followUserAccount = async(req: Request, res: Response) => {

    const currentUserId = req.data.id
    const {followUserId} = req.body

    if (!followUserId) {
        return res.status(400).json({ message: "followUserId wajib diisi" });
    }

    if(Number(currentUserId) === Number(followUserId)){
        return res.status(400).json({message: "Tidak bisa follow akun sendiri"});
    }

    const otherUserId = await prisma.user.findUnique({
        where: {
            id: Number(followUserId)
        }
    });

    if(!otherUserId){
        return res.status(404).json({message: "user Id tidak ditemukan"});
    }

    const isFollowUser = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: Number(currentUserId),
                followingId: Number(followUserId)
            }
        }
    });

    if(isFollowUser){
        return res.status(400).json({
            message: "User sudah pernah di follow"
        })
    }

    try {
        const follow = await prisma.follow.create({
            data: {
                followerId: Number(currentUserId),
                followingId: Number(followUserId)
            }
        });
        //update user count
        await prisma.user.update({
            where: {
                id: currentUserId
            },
            data: {
                followingCount: {
                    increment: 1
                }
            }
        });
        await prisma.user.update({
            where: {
                id: Number(followUserId)
            },
            data: {
                followerCount: {
                    increment: 1
                }
            }
        });

        res.status(201).json({
            message: "Follow User Berhasil",
            data: follow
        })
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: "internal server"
        })
    }
}

export const unfollowAccount = async (req: Request, res: Response) => {
    const unfollowId = req.params.unfollow
    const currentUserId = req.data.id

    const Userunfollow = await prisma.user.findUnique({
        where:{
            id: Number(unfollowId)
        }
    })

    if(!Userunfollow){
        return res.status(404).json({
            message: "user tidak ditemukan"
        })
    }

    try {
       await prisma.follow.delete({
        where: {
            followerId_followingId: {
                followerId: Number(currentUserId),
                followingId: Number(unfollowId)
            },
        },
    });

    //count user following dan follower
    await prisma.user.update({
        where: {
            id: Number(currentUserId)
        },
        data: {
            followingCount: {
                decrement: 1
            },
        },
    });

    await prisma.user.update({
        where: {
            id: Number(unfollowId)
        },
        data: {
            followerCount: {
                decrement: 1
            },
        },
    });

    res.status(200).json({message: "user berhasil di unfollow"});

    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: "internal server",
            error
        })
    }
}

export const getLimitUser = async(req: Request, res: Response ) => {
    try {
        const currentUserId = req.data.id
        const followedtUser = await prisma.follow.findMany({
            where:{followerId: currentUserId},
            select: {followingId: true}
        })
        const followedIds = followedtUser.map(f => f.followingId)

        const users = await prisma.user.findMany({
            where: {
                id: {
                    notIn: [...followedIds, currentUserId]
                }
            },
            select: {
                id: true,
                image: true,
                fullname: true,
                username: true
            },
            take: 5,
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({message: "5 user belem di follow", data: users});

    } catch (error) {
        console.log(error);
        
        res.status(500).json({message: "internal server",
            error
        })
    }
}

export const followUser = async(req: Request, res: Response) => {
    try {
        const currentUserId = req.data.id
        const {followId} = req.params

        const checkFollowUserId = await prisma.user.findUnique({
            where: {
                id: Number(followId)
            }
        });

        if(!checkFollowUserId){
            return res.status(404).json({
                message: "user tidak di temukan"
            })
        }

        const followUserData = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: Number(followId),
                    followingId: currentUserId
                }
            }
        })

        if(followUserData){
            return res.status(200).json({data: true})
        }
        return res.status(200).json({data: false})

    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: "internal server", error
        })
    }
}