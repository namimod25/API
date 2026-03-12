import { getMessage, sendMessage } from "@/controllers/message.controller";
import { isAuth } from "@/middleware/AuthMiddleware";
import express  from "express";

const MessageRouter = express.Router();
//get otherId
MessageRouter.get('/:otherUserId', isAuth, getMessage)

//post untuk send message user id
MessageRouter.post('/send/:otherUserId', isAuth, sendMessage)
export default MessageRouter