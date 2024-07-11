import { GENESIS_DATA, DIFFICULTY, MINE_RATE } from '../config/settings.js';
import IBlock from '../interfaces/IBlock.js';
import IBlockchain from '../interfaces/IBlockchain.js';
import Block from './Block.js';

class Blockchain implements IBlockchain {
  chain: Block[];
  pendingTransactions: [];

  constructor() {
    this.chain = [Block.genesis()];
    this.pendingTransactions = [];
    // RECHECK: chekc this structure if i want like this
    // this.currentTransactions =[];
    // this.nodes =[]
    // this.io=io
  }

  async createBlock(): Promise<Block> {
    const prevBlock = this.getPrevBlock();
    const timestamp = Date.now();
    const index = prevBlock.index + 1;
    const previousHash = prevBlock.hash;
    const data = this.pendingTransactions;

    const { nonce, difficulty, hash } = this.proofOfWork(data);
    const newBlock = new Block(
      timestamp,
      index,
      previousHash,
      hash,
      data,
      nonce,
      difficulty
    );

    this.chain.push(newBlock);
    this.pendingTransactions = [];
    return newBlock;
  }

  // mineBlock
  proofOfWork(data: any) {
    const prevBlock = this.getPrevBlock();
    let timestamp, hash;
    let { difficulty } = prevBlock;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = this.adjustDifficulty(prevBlock, Date.now());
      hash = Block.createHash(
        timestamp,
        prevBlock.hash,
        data,
        nonce,
        difficulty
      );
    } while (!this.isValidHash(hash, difficulty));

    return { timestamp, hash, difficulty, nonce };
  }

  isValidChain(chain: Block[]): boolean {
    if (JSON.stringify(chain.at(0)) !== JSON.stringify(Block.genesis)) {
      return false;
    }

    // Loop through blockchain
    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const previousBlock = chain[i - 1];

      if (
        currentBlock.hash !==
        Block.createHash(
          currentBlock.timestamp,
          currentBlock.previousHash,
          currentBlock.data,
          currentBlock.nonce,
          currentBlock.difficulty
        )
      ) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) return false;
    }
    return true;
  }

  replaceChain(newChain: Block[]): void {
    if (newChain.length <= this.chain.length) return;
    if (!this.isValidChain(newChain)) return;

    this.chain = newChain;
  }

  // -------------------- PRIVATE -------------------- //
  private adjustDifficulty(prevBlock: Block, timeNow: number): number {
    let { difficulty, timestamp } = prevBlock;
    return timestamp + MINE_RATE > timeNow ? difficulty + 1 : difficulty - 1;
  }

  private getPrevBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  private isValidHash(hash: string, difficulty: number): boolean {
    return hash.substring(0, difficulty) === '0'.repeat(difficulty);
  }
}

export default Blockchain;
