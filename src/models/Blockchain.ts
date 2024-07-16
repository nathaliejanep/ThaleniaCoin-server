import { GENESIS_DATA, DIFFICULTY, MINE_RATE } from '../config/settings.js';
import IBlock from '../interfaces/IBlock.js';
import IBlockchain from '../interfaces/IBlockchain.js';
import { createHash } from '../utils/crypto-lib.js';
import Block from './Block.js';
import BlockModel from './BlockModel.js';
import BlockSchema from './BlockModel.js';
import TransactionModel from './TransactionModel.js';

class Blockchain implements IBlockchain {
  chain: Block[];
  // pendingTransactions: any[];

  constructor() {
    this.chain = [Block.genesis()];
    // this.pendingTransactions = [];
    this.loadBlockchainDb();
    // RECHECK: chekc this structure if i want like this
    // this.currentTransactions =[];
    // this.nodes =[]
    // this.io=io
  }

  // async addTransaction(transaction: any): Promise<number> {
  //   // this.pendingTransactions.push(transaction);

  //   const txModel = new TransactionModel(transaction);
  //   await txModel.save();
  //   // TODO
  //   // pubnub.broadcastTransaction(transaction);

  //   // TODO should this really return?
  //   return this.getPrevBlock().index + 1;
  // }

  // TYPE: for data?{}? Block?
  async createBlock({ data }: any): Promise<Block> {
    // const prevBlock = this.getPrevBlock();
    // const timestamp = Date.now();
    // const index = prevBlock.index + 1;
    // const previousHash = prevBlock.hash;
    //  const data = this.pendingTransactions;

    // const { nonce, difficulty, hash } = this.proofOfWork(data, prevBlock);

    // const newBlock = new Block(
    //   timestamp,
    //   index,
    //   previousHash,
    //   hash,
    //   data,
    //   nonce,
    //   difficulty
    // );

    // RECHECK if this works
    // const prevBlock = this.getPrevBlock();

    // BUG if we get bug tryy change
    // const prevBlock = this.chain[this.chain.length - 1];
    const prevBlock = this.chain.at(-1);
    const newBlock = Block.mineBlock({ prevBlock, data });

    this.chain.push(newBlock);

    // TODO delete previous blocks from mongodb?
    const blockModel = new BlockSchema(newBlock);
    await blockModel.save();
    return newBlock;
  }

  // getTransactions(): any[] {
  //   let transactions = [];
  //   for (let block of this.chain) {
  //     for (let transaction of block.data) {
  //       transactions.push(transaction);
  //     }
  //   }
  //   return transactions;
  // }

  async loadBlockchainDb(): Promise<void> {
    try {
      const blocks = await BlockModel.find().sort({ index: 1 });

      this.chain = blocks.map((block) => {
        return new Block({
          timestamp: block.timestamp,
          index: block.index,
          previousHash: block.previousHash,
          hash: block.hash,
          data: block.data,
          nonce: block.nonce,
          difficulty: block.difficulty,
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  // Mine block
  // MOVED TO BLOCK
  // proofOfWork(data: any, prevBlock: Block) {
  //   // const prevBlock = this.getPrevBlock();
  //   let timestamp, hash;
  //   let { difficulty } = prevBlock;
  //   let nonce = 0;

  //   do {
  //     nonce++;
  //     timestamp = Date.now();
  //     difficulty = this.adjustDifficulty(prevBlock, timestamp);
  //     hash = this.calculateHash(
  //       timestamp,
  //       prevBlock.index + 1,
  //       prevBlock.hash,
  //       data,
  //       nonce,
  //       difficulty
  //     );
  //   } while (!this.isValidHash(hash, difficulty));

  //   return { timestamp, hash, difficulty, nonce };
  // }

  isValidChain(chain: Block[]): boolean {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      console.log('genesis block is not the same');
      return false;
    }

    // Loop through blockchain
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      // const previousBlock = this.getPrevBlock();
      const previousBlock = chain[i - 1];

      if (block.previousHash !== previousBlock.hash) return false;

      if (Math.abs(previousBlock.difficulty - block.difficulty) > 1) {
        return false;
      }

      const validHash: string = createHash({
        timestamp: block.timestamp,
        index: block.index,
        previousHash: block.previousHash,
        data: block.data,
        nonce: block.nonce,
        difficulty: block.difficulty,
      });

      if (block.hash !== validHash) {
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
  // MOVED TO Block
  // private adjustDifficulty(prevBlock: Block, timeNow: number): number {
  //   let { difficulty, timestamp } = prevBlock;
  //   return timestamp + MINE_RATE > timeNow ? difficulty + 1 : difficulty - 1;
  // }

  private getPrevBlock(): Block {
    return this.chain[this.chain.length - 1];
  }
  // MOVED TO Block
  // private isValidHash(hash: string, difficulty: number): boolean {
  //   return hash.substring(0, difficulty) === '0'.repeat(difficulty);
  // }
}

export default Blockchain;
