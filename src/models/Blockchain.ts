import { GENESIS_DATA, DIFFICULTY, MINE_RATE } from '../config/settings.js';
import IBlock from '../interfaces/IBlock.js';
import IBlockchain from '../interfaces/IBlockchain.js';
import createHash from '../utils/crypto-lib.js';
import Block from './Block.js';
import BlockModel from './BlockModel.js';
import BlockSchema from './BlockModel.js';
import TransactionModel from './TransactionModel.js';

class Blockchain implements IBlockchain {
  chain: Block[];
  pendingTransactions: any[];

  constructor() {
    this.chain = [Block.genesis()];
    this.pendingTransactions = [];
    this.loadBlockchainDb();
    // RECHECK: chekc this structure if i want like this
    // this.currentTransactions =[];
    // this.nodes =[]
    // this.io=io
  }

  async addTransaction(transaction: any): Promise<number> {
    this.pendingTransactions.push(transaction);

    const txModel = new TransactionModel(transaction);
    await txModel.save();
    // TODO
    // pubnub.broadcastTransaction(transaction);

    // TODO should this really return?
    return this.getPrevBlock().index + 1;
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

    // TODO delete previous blocks from mongodb?
    const blockModel = new BlockSchema(newBlock);
    await blockModel.save();
    return newBlock;
  }

  getTransactions(): any[] {
    let transactions = [];
    for (let block of this.chain) {
      for (let transaction of block.data) {
        transactions.push(transaction);
      }
    }
    return transactions;
  }

  async loadBlockchainDb(): Promise<void> {
    try {
      const blocks = await BlockModel.find().sort({ index: 1 });

      this.chain = blocks.map((block) => {
        return new Block(
          block.timestamp,
          block.index,
          block.previousHash,
          block.hash,
          block.data,
          block.nonce,
          block.difficulty
        );
      });
    } catch (err) {
      console.log(err);
    }
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

      difficulty = this.adjustDifficulty(prevBlock, timestamp);

      hash = this.calculateHash(
        timestamp,
        prevBlock.index + 1,
        prevBlock.hash,
        data,
        nonce,
        difficulty
      );
    } while (!this.isValidHash(hash, difficulty));

    return { timestamp, hash, difficulty, nonce };
  }

  isValidChain(chain: Block[]): boolean {
    if (JSON.stringify(chain[0]) !== JSON.stringify(GENESIS_DATA)) {
      console.log('genesis block is not the same');
      return false;
    }

    // Loop through blockchain
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const previousBlock = this.getPrevBlock();
      // const previousBlock = chain[i - 1];

      const hash = this.calculateHash(
        block.timestamp,
        block.index,
        block.previousHash,
        block.data,
        block.nonce,
        block.difficulty
      );

      // BUG fix this
      // if (hash !== block.hash) {
      //   console.log('----calculated hash----', hash);
      //   console.log('----block hash----', block.hash);
      //   console.log('hash is not the same');
      //   return false;
      // }

      if (block.previousHash !== previousBlock.hash) {
        console.log('previous hash is not the same');
        return false;
      }
    }
    console.log('chain is valid');
    return true;
  }

  async replaceChain(newChain: Block[]): Promise<void> {
    if (newChain.length <= this.chain.length) {
      console.log('received chain is not longer than the current chain');
      return;
    }
    if (!this.isValidChain(newChain)) {
      console.log('received chain is not valid');
      return;
    }
    console.log('replaces chain');
    this.chain = newChain;

    await BlockModel.deleteMany({});
    await BlockModel.insertMany(this.chain);
  }

  // -------------------- PRIVATE -------------------- //
  private adjustDifficulty(prevBlock: Block, timeNow: number): number {
    let { difficulty, timestamp } = prevBlock;
    return timestamp + MINE_RATE > timeNow ? difficulty + 1 : difficulty - 1;
  }

  private calculateHash(
    timestamp: number,
    index: number,
    prevHash: string,
    data: string[],
    nonce: number,
    difficulty: number
  ) {
    const stringToHash =
      timestamp.toString() +
      index.toString() +
      prevHash +
      JSON.stringify(data).toString() +
      nonce.toString() +
      difficulty.toString();

    return createHash(stringToHash);
  }
  private getPrevBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  private isValidHash(hash: string, difficulty: number): boolean {
    return hash.substring(0, difficulty) === '0'.repeat(difficulty);
  }
}

export default Blockchain;
