import IBlock from '../interfaces/IBlock.js';
import IBlockchain from '../interfaces/IBlockchain.js';
import Block from './BlockModel.js';

class Blockchain implements IBlockchain {
  chain: Block[];
  constructor() {
    this.chain = [Block.genesis];
    // RECHECK: chekc this structure if i want like this
    // this.currentTransactions =[];
    // this.nodes =[]
    // this.io=io
  }

  createBlock(transactions: any) {
    const lastBlock = this.getLastBlock();
    const newTimestamp = Date.now();
    const newIndex = lastBlock.index + 1;
    const previousHash = lastBlock.hash;

    // const { nonce, difficulty, hash } = this.proofOfWork(lastBlock.hash, data);

    // const newBlock = new Block(
    //   newTimestamp,
    //   newIndex,
    //   transactions,
    //   previousHash,
    //   hash,
    //   nonce,
    //   difficulty
    // );
  }

  proofOfWork(lastBlockHash: string, data: any) {
    const lastBlock = this.getLastBlock();
    let timestamp, difficulty, hash;

    const generateHash = () => {};
  }

  isValidChain(arg: any) {}

  private getLastBlock(): Block {
    return this.chain[this.chain.length - 1];
  }
}
export default Blockchain;
