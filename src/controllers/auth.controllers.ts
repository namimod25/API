import { RequestHandler } from "express";
import User from "@/models/User";
import jwt from 'jsonwebtoken'
import cloudinary from "@/utils/cloudinary";

const JWT_SECRET = process.env.JWT_SECRET!

export const Register: RequestHandler = async (req, res) => {

    const { name, email, password } = req.body
    await User.create({
        name,
        email,
        password
    })
    res.status(201).json({
        message: "Register succes"
    })

}

export const LoginUser: RequestHandler = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(422).json({
            message: "email dan password harus di isi"
        })
        return
    }

    const userDoc = await User.findOne({ email })
    if (!userDoc) {
        res.status(403).json({
            message: "email belum terdaftar"
        })
        return
    }

    const isPasswordMatched = await userDoc.comparePassword(password)
    if (!isPasswordMatched) {
        res.status(403).json({
            message: "password yang dimasukan salah"
        })
        return
    }
    const AccesToken = jwt.sign({ id: userDoc._id }, JWT_SECRET)

    userDoc.token = AccesToken

    await userDoc.save()

    res.status(200).json({
        user: {
            id: userDoc._id,
            email: userDoc.email,
            name: userDoc.name,
            avatar: userDoc.avatar?.url
        },
        token: AccesToken
    })
}

export const Logout: RequestHandler = async (req, res) => {
    const userDoc = await User.findOne({ _id: req.user.id })

    if (!userDoc) {
        res.status(403).json({
            message: "User tidak ditemukan"
        })
        return
    }

    userDoc.token = null
    await userDoc.save();

    res.status(200).json({
        message: "Logout berhasil"
    })
}

export const getProfile: RequestHandler = async (req, res) => {
    res.json({
        user: req.user
    })
}

export const getUsers: RequestHandler = async (req, res) => {
    const getUsersData = await User.find({ _id: { $ne: req.user.id } }).select(['-password', '-token'])

    res.json({
        message: "all users",
        data: getUsersData

    })
}

export const uploadAvatar: RequestHandler = async (req, res) => {
    try {
        if (!req.file) {
            res.status(422).json({
                message: "file belum ada yang di upload"
            })
            return
        }
        const userDoc = await User.findById(req.user.id)
        if (!userDoc) {
            res.status(404).json({
                message: "user tidak ditemukan"
            })
            return
        }
        if (userDoc.avatar && userDoc.avatar.id) {
            try {
                await cloudinary.uploader.destroy(userDoc.avatar.id)

            } catch (err: any) {
                console.log("gagal hapus avatar : ", err);
                res.status(422).json({
                    message: "gagal hapus avatar"
                })
                return
            }
        }

        //buffer cover
        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
        const result = await cloudinary.uploader.upload(fileStr, {
            folder: 'profile',
            transformation: [{
                width: 600,
                height: 600,
                crop: 'thumb',
                gravity: 'face'
            }]
        })

        userDoc.avatar = {
            url: result.secure_url,
            id: result.public_id
        }
        await userDoc.save()

        res.status(201).json({
            message: "profile avatar berhasil diupload",
            User: {
                id: userDoc._id,
                name: userDoc.name,
                email: userDoc.email,
                avatar: userDoc.avatar.url
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "upload failed",
            error: error
        })
    }
}

export const editUserByToken:RequestHandler = async (req, res) =>{
    const userDoc = await User.findById(req.user.id);

    if(!userDoc){
        res.status(404).json({
            message: "user tidak ada"
        })
        return
    }

    const {name, bio} = req.body
    userDoc.name = name
    userDoc.bio = bio

    await userDoc.save()
    res.status(201).json({
        message: "Update succes",
        data: {
            id: userDoc._id,
            name: userDoc.name,
            email: userDoc.email,
            bio: userDoc.bio,
            avatar: userDoc.avatar?.url
        }
    })
}

export const editPasswordByToken:RequestHandler = async (req, res) => {
    const {old_password, new_password, confirm_password} = req.body

    if(!old_password || !new_password || !confirm_password){
        res.status(422).json({
            message: 'Inputan password belum lengkap'
        })
        return
    }
    const userDoc = await User.findById(req.user.id)

    if(!userDoc){
        res.status(404).json({
            message: "user tidak ada"
        })
        return
    }
    //perbandingan password
    const isPasswordMatched = await userDoc.comparePassword(old_password);

    if(!isPasswordMatched){
        res.status(422).json({
            message: "Password lama yang dimasukan tidak sesuai yang ada didalam database"
        })
       return
    }

    if(new_password.length <=6){
        res.status(422).json({
            message: "Password baru harus lebih dari 6 karakter"
        })
        return
    }

    if(new_password !== confirm_password){
          res.status(422).json({
            message: "Password baru tidak sesuai dengan confirm password"
        })
        return
    }

    userDoc.password = new_password
    await userDoc.save()
    res.status(201).json({
        message: "passwod terupdate"
    })
}