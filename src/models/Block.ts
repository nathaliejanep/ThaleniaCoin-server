import { DIFFICULTY, GENESIS_DATA } from '../config/settings.js';
import IBlock from '../interfaces/IBlock.js';
class Block implements IBlock {
  timestamp;
  index;
  previousHash;
  hash;
  data;
  nonce;
  difficulty;

  constructor(
    timestamp: number,
    index: number,
    previousHash: string,
    hash: string,
    data: Array<any>, // FIXME <Transaction> or Transaction[]
    nonce: number,
    difficulty: number
  ) {
    this.timestamp = timestamp;
    this.index = index;
    this.previousHash = previousHash;
    this.hash = hash;
    this.data = data;
    this.nonce = 0; // RECHECK check if should be nonce or 0
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

  // static get genesis(): Block {
  //   return new this(
  //     GENESIS_DATA.timestamp,
  //     GENESIS_DATA.index,
  //     GENESIS_DATA.previousHash,
  //     GENESIS_DATA.hash,
  //     GENESIS_DATA.transactions
  //     GENESIS_DATA.nonce,
  //     GENESIS_DATA.difficulty,
  //   );
  // }

  static mineBlock(lastBlock: any, data: any) {}

  // LEARN delve into get
  static genesis() {
    return new Block(Date.now(), 0, '0', 'genesis-hash', [], 0, DIFFICULTY);
  }
  static createHash(
    timestamp: number,
    prevHash: string,
    data: any,
    nonce: number,
    difficulty: number
  ): string {
    return (
      timestamp.toString() +
      prevHash +
      data +
      nonce.toString() +
      difficulty.toString()
    );
  }
}
export default Block;
