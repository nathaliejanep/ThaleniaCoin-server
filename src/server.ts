import express, { Application, urlencoded } from 'express';
import cors from 'cors';
import connectDb from './config/mongoDb.js';
import dotenv from 'dotenv';
import authRouter from './routes/auth-routes.js';
import ErrorHandler from './middleware/ErrorHandler.js';
import morgan from 'morgan';
import { CORS_OPTIONS } from './config/settings.js';
import Blockchain from './models/Blockchain.js';
import PubNubServer from './pubnubServer.js';
import { BaseError } from './models/BaseErrorModel.js';

dotenv.config();

const PORT: number = Number(process.env.PORT) || 3001;
const ROOT_NODE = `http://localhost:${PORT}`;

let NODE_PORT =
  process.env.DYNAMIC_NODE_PORT === 'true'
    ? PORT + Math.floor(Math.random() * 1000)
    : PORT;

export const blockchain = new Blockchain();
export const pubnub = new PubNubServer(blockchain, NODE_PORT);

const app: Application = express();

app.use(cors(CORS_OPTIONS));
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/auth', authRouter);

app.all('*', (req, res, next) => {
  next(new BaseError(`Could not find the resource: ${req.originalUrl}`, 404));
});

app.use(ErrorHandler);

// app.use('/api/v1/users',usersRouter)
// app.use('/api/v1/auth',authRouter)
// app.use('/api/v1/auth',authRouter)
connectDb();

const syncBlockchain = async () => {
  try {
    // FIXME change name and change routes after
    const response = await fetch(`${ROOT_NODE}/api/v1/idtrust/blockchain`);

    if (response.ok) {
      const { data } = await response.json();
      // blockchain.updateChain(data);
    } else {
      console.error('Failed to sync blockchain: Server response not OK');
    }
  } catch (err: any) {
    console.error(`Failed to sync blockchain: ${err.message}`);
  }
};

const server = app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
  if (NODE_PORT !== PORT) {
    syncBlockchain();
  }
});

// Handle rejections that is not handled elsewhere in application…
process.on('unhandledRejection', (err: Error, promise: Promise<any>) => {
  console.log(`ERR: ${err.message}`);
  // Close and send anonymous callback function
  server.close(() => process.exit(1));
});
