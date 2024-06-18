// https://dev.to/ibrocodes/a-simple-guide-to-setting-up-typescript-with-nodejs-and-express-2024-lej
import express, { Application, urlencoded } from 'express';
import connectDb from './config/mongoDb.js';
import dotenv from 'dotenv';
import authRouter from './routes/auth-routes.js';
import errorHandler from './middleware/ErrorHandler.js';
dotenv.config();

const PORT = process.env.PORT || 8000;
const app: Application = express();

// app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/v1/auth', authRouter);

app.use(errorHandler);

// app.use('/api/v1/users',usersRouter)
// app.use('/api/v1/auth',authRouter)
// app.use('/api/v1/auth',authRouter)
connectDb();

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});

// Hantera fel(Rejections) som inte hanteras någon annanstans i applikation...
