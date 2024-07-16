import { DIFFICULTY, GENESIS_DATA, MINE_RATE } from '../config/settings.js';
import IBlock from '../interfaces/IBlock.js';
import { blockchain } from '../server.js';
import { createHash } from '../utils/crypto-lib.js';
class Block implements IBlock {
  timestamp;
  index;
  previousHash;
  hash;
  data;
  nonce;
  difficulty;

  constructor({
    timestamp,
    index,
    previousHash,
    hash,
    data,
    nonce,
    difficulty,
  }: {
    timestamp: number;
    index: number;
    previousHash: string;
    hash: string;
    data: Array<any>; // TYPE <Transaction> or Transaction[]
    nonce: number;
    difficulty: number;
  }) {
    this.timestamp = timestamp;
    this.index = index;
    this.previousHash = previousHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce; // RECHECK check if should be nonce or 0
    this.difficulty = difficulty;
    // this.difficulty = difficulty || +process.env.INITIAL_DIFFICULTY;
  }

  toString(): string {
    return `Block -
        Timestamp : ${this.timestamp}
        Data      : ${this.data}
        Last Hash : ${this.previousHash}
        Hash      : ${this.hash}
        Nonce     : ${this.nonce}
        Difficulty: ${this.difficulty}
    `;
  }

  // RECHECK if this is correct
  static adjustDifficulty({
    prevBlock,
    timeNow,
  }: {
    prevBlock: Block;
    timeNow: any; // TYPE number or date
  }): number {
    let { difficulty, timestamp } = prevBlock;
    const targetBlockTime = timestamp + MINE_RATE;
    difficulty = targetBlockTime > timeNow ? difficulty + 1 : difficulty - 1;
    if (difficulty < 1) difficulty = 1;

    return difficulty;
  }
  // static get genesis(): Block {
  // }

  // LEARN delve into get
  static genesis() {
    return new Block(GENESIS_DATA);
  }

  // TYPE boolean to return
  static isValidHash(hash: string, difficulty: number): any {
    return hash.substring(0, difficulty) === '0'.repeat(difficulty);
  }

  static mineBlock({ prevBlock, data }: { prevBlock: any; data: any }) {
    const previousHash = prevBlock.hash;
    const index = prevBlock.index + 1;

    let timestamp;
    let hash: string;
    let { difficulty } = prevBlock;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = this.adjustDifficulty({ prevBlock, timeNow: timestamp });

      hash = createHash({
        timestamp,
        index: prevBlock.index + 1,
        previousHash: prevBlock.hash,
        data,
        nonce,
        difficulty,
      });
    } while (!this.isValidHash(hash, difficulty));

    return new this({
      timestamp,
      index,
      previousHash,
      hash,
      data,
      nonce,
      difficulty,
    });
  }
}
export default Block;
