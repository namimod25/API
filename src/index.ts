import express from 'express';
import cors from 'cors';
import  '../src/db/config.ts';
import router from './router/Auth.Router';

const app = express();
const port = 5030

//middleware
app.use(cors())
app.use(express.json());


app.use('/api/auth', router);

app.listen(port,  () => {
  console.log(`API running at ${port}`);
});