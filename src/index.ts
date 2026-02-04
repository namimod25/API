import express from 'express'
import 'dotenv/config'
import './db/config'
import authRouter from './router/Auth.Router'
import { errorHandler, NotFound } from './middleware/errorHandler'

const app = express()
const port = 6000

//middleware
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/auth', authRouter)

app.use(errorHandler)
app.use(NotFound)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})