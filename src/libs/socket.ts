import {Server} from 'socket.io'
import http from 'http'
import express from 'express'

const app = express();
const server = http.createServer(app)

const io = new Server(server,{
    cors: {
        origin: ["*"]
    }
})

const userSocketMap  :Record<string, string> = {}

export function getOtherSocketId(userId: string) {
        return userSocketMap[userId]
    }

io.on("connection", (socket) => {
    console.log("terhubung", socket.id);
    const userId = socket.handshake.query.userId as string | undefined

    

    if (userId) {
        userSocketMap[userId] = socket.id
    }
    io.emit("online user", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("Disconnect", socket.id);
        if (userId) {
            delete userSocketMap[userId]
        }
        io.emit("online user", Object.keys(userSocketMap))
    });
})

export {io, app, server}