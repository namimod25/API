import User from '@/models/User';
import { RequestHandler } from 'express';
import jwt, { TokenExpiredError, JsonWebTokenError} from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!

interface userDocument {
    id: any
    name: string
    email: string
    avatar?: string | undefined,
    bio?: string | undefined
}

declare global {
    namespace Express {
        interface Request {
            user: userDocument
        }
    }
}

export const isAuth: RequestHandler = async (req, res, next) => {
    try {
        const HeaderToken = req.headers.authorization

        if (!HeaderToken) {
            res.status(401).json({
                message: "verifikasi gagal"
            })
            return
        }
        const token = HeaderToken.split('Bearer ')[1]

        if (!token) {
            res.status(401).json({
                message: "token tidak valid"
            })
            return
        }

        const decoded = jwt.verify(token, JWT_SECRET) as unknown as { id: string };

        const userDoc = await User.findById(decoded.id)

        if (!userDoc) {
            res.status(404).json({
                message: 'user tidak ditemukan'
            })
            return
        }

        req.user = {
            id: userDoc._id,
            name: userDoc.name,
            email: userDoc.email,
            avatar: userDoc.avatar?.url,
            bio: userDoc.bio
        }
        next();

    } catch (error) {
        if(error instanceof TokenExpiredError){
            res.status(401).json({
                message: "Token sudah expire"
            })
            return
        }
        if(error instanceof JsonWebTokenError){
            res.status(401).json({
                message: "unauthorize Request"
            })
            return
        }
        next(error)
    }
}

