import IBlock from '../interfaces/IBlock.js';
import { IUser } from '../interfaces/IUser.js';

const CORS_OPTIONS = {
  credentials: true,
  origin: ['http://localhost:5173'],
};

const DIFFICULTY = 3;
const INITIAL_BALANCE = 1000;

const MINE_RATE = 1000;
const MINING_REWARD = 50;
const REWARD_ADDRESS = '*authorized-reward-address*';
//  const REWARD_ADDRESS = { address: 'reward-address' };

const GENESIS_DATA: IBlock = {
  timestamp: 1,
  index: 0,
  previousHash: '0',
  hash: '0',
  data: ['genesis block'],
  nonce: 0,
  difficulty: +DIFFICULTY,
};

export {
  MINE_RATE,
  CORS_OPTIONS,
  GENESIS_DATA,
  DIFFICULTY,
  INITIAL_BALANCE,
  MINING_REWARD,
  REWARD_ADDRESS,
};
