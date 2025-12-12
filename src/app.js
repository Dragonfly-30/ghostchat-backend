import express from 'express'
import userRouter from './routes/user.routes.js';
import messageRouter from './routes/message.routes.js'
const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Optional but good practice

app.use('/api/user', userRouter)
app.use('/api/messages', messageRouter)
app.use('/api/messages', messageRouter)
app.use('/api/user', userRouter)


// In app.js (after all routes)
app.use((err, req, res, next) => {
  // If it's our custom error, use its status code
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    errors: err.errors || [],
    // Only show stack trace in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

export { app }

