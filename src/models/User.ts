import { model, Schema, Document, Model } from "mongoose";
import { compare, genSalt, hash } from "bcrypt";

interface UserDocument extends Document {
    email: string,
    password: string,
    name: string,
    token?: string | null,
    bio?: string,
    avatar?: {
        url: string,
        id: string
    } | undefined
}

interface Methods {
    comparePassword(inputPassword: string): Promise<boolean>
}

type UserModel = Model<UserDocument, {}, Methods>;

const UserSchema = new Schema<UserDocument, UserModel, Methods>({
    email: {
        required: [true, "email wajib di isi"],
        type: String,
        unique: [true, "email sudah terdaftar"],
        match: [/\S+@\S+\.\S+/, ' masukan format email yang benar']
    },
    name: {
        required: [true, "user wajib di isi"],
        type: String,
        unique: [true, "username sudah terdaftar, gunakan yang lain"]
    },
    password: {
        required: [true, "password wajib di isi"],
        type: String,
        min: [6, "password minim 6 karakter"]
    },
    token: {
        type: String
    },
    bio: {
        type: String
    },
    avatar: {
        url: String,
        id: String
    }
}, {
    timestamps: true
})

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await genSalt(12)
        this.password = await hash(this.password, salt)
    }
    next
})

UserSchema.methods.comparePassword = async function (inputPassword: string) {
    return await compare(inputPassword, this.password)
}

const User = model<UserDocument, UserModel>("User", UserSchema)

export default User