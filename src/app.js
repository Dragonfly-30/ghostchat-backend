import express from 'express'
import userRouter from './routes/user.routes.js';
import messageRouter from './routes/message.routes.js'
const app = express();

app.use(express.json({ limit: "16kb" })); 
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Optional but good practice

app.use('/api/user', userRouter)
app.use('/api/messages', messageRouter)
app.use('/api/user', userRouter)




export {app}
  
