import express from 'express'
import 'dotenv/config'
import './db/config'
import authRouter from './router/Auth.Router'
import { errorHandler, NotFound } from './middleware/errorHandler'
import cors from 'cors'
import MessageRouter from './router/Message.Router'
import { app, server } from './libs/socket'

const port = 5030

//middleware
app.use(cors())
app.use(express.json())



app.use('/api/auth', authRouter)
app.use('/api/message', MessageRouter)

app.use(errorHandler)
app.use(NotFound)

server.listen(port, '0.0.0.0', () => {
  console.log(`API running at http://0.0.0.0:${port}`);
});