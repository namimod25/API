import {Document, model, ObjectId, Schema} from 'mongoose'

interface MessageDocument extends Document {
    senderId: ObjectId,
    receiverId: ObjectId,
    text: String
}

    const messageSchema = new Schema<MessageDocument>({
        senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        rquired: true
    }
}, {
    timestamps: true
})
    const Message = model ('message', messageSchema)
export default Message