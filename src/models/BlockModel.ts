import { SHA256 } from 'crypto-js';
import { GENESIS_DATA } from '../config/settings.js';
import IBlock from '../interfaces/IBlock.js';
class Block implements IBlock {
  timestamp;
  index;
  previousHash;
  hash;
  nonce;
  difficulty;
  transactions;

  constructor(
    timestamp: number,
    index: number,
    previousHash: string,
    hash: string,
    nonce: number,
    difficulty: number,
    transactions: Array<any> // FIXME <Transaction> or Transaction[]
  ) {
    this.timestamp = timestamp;
    this.index = index;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0; // RECHECK check if should be nonce or 0
    this.difficulty = difficulty;
    this.transactions = transactions;
    // this.difficulty = difficulty || +process.env.INITIAL_DIFFICULTY;
  }

  toString(): string {
    return `Block -
        Timestamp : ${this.timestamp}
        Data      : ${this.transactions}
        Last Hash : ${this.previousHash}
        Hash      : ${this.hash}
        Nonce     : ${this.nonce}
        Difficulty: ${this.difficulty}
    `;
  }

  // LEARN delve into get
  static get genesis(): Block {
    return new this(
      GENESIS_DATA.timestamp,
      GENESIS_DATA.index,
      GENESIS_DATA.previousHash,
      GENESIS_DATA.hash,
      GENESIS_DATA.nonce,
      GENESIS_DATA.difficulty,
      GENESIS_DATA.transactions
    );
  }

  static mineBlock(lastBlock: any, data: any) {}

  private calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.nonce
    ).toString();
  }
}
export default Block;
