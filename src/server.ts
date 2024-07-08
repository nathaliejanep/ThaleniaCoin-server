// https://dev.to/ibrocodes/a-simple-guide-to-setting-up-typescript-with-nodejs-and-express-2024-lej
import express, { Application, urlencoded } from 'express';
import cors from 'cors';
import connectDb from './config/mongoDb.js';
import dotenv from 'dotenv';
import authRouter from './routes/auth-routes.js';
import errorHandler from './middleware/ErrorHandler.js';
import morgan from 'morgan';
import { CORS_OPTIONS } from './config/settings.js';
dotenv.config();

const PORT = process.env.PORT || 8000;
const app: Application = express();

app.use(cors(CORS_OPTIONS));
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/v1/auth', authRouter);
app.use(errorHandler);

// app.use('/api/v1/users',usersRouter)
// app.use('/api/v1/auth',authRouter)
// app.use('/api/v1/auth',authRouter)
connectDb();

const server = app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});

// Handle rejections that is not handled elsewhere in application…
process.on('unhandledRejection', (err: Error, promise: Promise<any>) => {
  console.log(`ERR: ${err.message}`);
  // Close and send anonymous callback function
  server.close(() => process.exit(1));
});
