import IBlock from '../interfaces/IBlock.js';
import { IUser } from '../interfaces/IUser.js';

const CORS_OPTIONS = {
  credentials: true,
  origin: ['http://localhost:5173'],
};

const MINE_RATE = 1000;
const DIFFICULTY = 3;

const GENESIS_DATA: IBlock = {
  timestamp: 1,
  index: 0,
  data: ['genesis block'],
  previousHash: '0',
  hash: '0',
  nonce: 0,
  difficulty: +DIFFICULTY,
};

export { MINE_RATE ,CORS_OPTIONS, GENESIS_DATA, DIFFICULTY };
