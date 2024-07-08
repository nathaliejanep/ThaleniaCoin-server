import IBlock from '../interfaces/IBlock.js';
import { IUser } from '../interfaces/IUser.js';

const CORS_OPTIONS = {
  credentials: true,
  origin: ['http://localhost:5173'],
};

const INITIAL_DIFFICULTY = 3;

const GENESIS_DATA: IBlock = {
  timestamp: 1,
  index: 0,
  transactions: ['genesis block'],
  previousHash: '0',
  hash: '0',
  nonce: 0,
  difficulty: +INITIAL_DIFFICULTY,
};

export { CORS_OPTIONS, GENESIS_DATA };
