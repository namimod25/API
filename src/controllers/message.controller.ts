import { getOtherSocketId, io } from '../libs/socket';
import Message from '../models/Message';
import { RequestHandler } from 'express';

export const getMessage: RequestHandler = async (req, res) => {
    const { otherUserId } = req.params

    if (!otherUserId || typeof otherUserId !== 'string') {
        res.status(400).json({ error: 'Invalid otherUserId' })
        return
    }

    try {
        const senderId = req.user.id

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: senderId },
            ]
        } as any)

        res.status(200).json(messages)
    } catch (error) {
        console.error('getMessage error:', error)
        res.status(500).json({ error: 'Failed to fetch messages' })
    }
}

export const sendMessage: RequestHandler = async (req, res) => {
    const { text } = req.body
    const { otherUserId } = req.params

    if (!otherUserId || typeof otherUserId !== 'string') {
        res.status(400).json({ error: 'Invalid otherUserId' })
        return
    }

    try {
        const senderId = req.user.id
        const newMessage = new Message({
            senderId,
            receiverId: otherUserId,
            text
        })
        await newMessage.save()

        const otherSocketId = getOtherSocketId(otherUserId)
        if (otherSocketId) {
            io.to(otherSocketId).emit('NewMessage', newMessage)
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.error('sendMessage error:', error)
        res.status(500).json({ error: 'Failed to send message' })
    }
}
