import { createHash, ellipticHash } from '../utils/crypto-lib.js';
import Transaction from './Transaction.js';
import { INITIAL_BALANCE } from '../config/settings.js';
import Block from './Block.js';

export default class Wallet {
  balance: number;
  keyPair: any; // Adjust type based on elliptic library's types
  publicKey: string;

  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ellipticHash.genKeyPair(); // Adjust type based on elliptic library's types
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  static calculateBalance({
    chain,
    address,
  }: {
    chain: any; // TYPE should be Block[]?
    address: string;
  }): number {
    let total = 0;
    let hasAddedTransaction = false;

    // Iterate through each block in the blockchain
    for (let i = chain.length - 1; i > 0; i--) {
      const block = chain[i];

      // Iterate through each transaction in the block
      for (let transaction of block.data) {
        if (transaction.input.address === address) {
          hasAddedTransaction = true;
        }

        const value = transaction.outputMap[address];

        if (value) {
          total += value;
        }
      }

      if (hasAddedTransaction) break;
    }

    return hasAddedTransaction ? total : INITIAL_BALANCE + total;
  }

  createTransaction({
    recipient,
    amount,
    chain,
  }: {
    recipient: string;
    amount: number;
    chain?: any; // TYPE should be Block[]?
  }): Transaction {
    if (chain) {
      this.balance = Wallet.calculateBalance({
        chain,
        address: this.publicKey,
      });
    }

    if (amount > this.balance) throw new Error('Not enough funds!');

    return new Transaction({ sender: this, recipient, amount });
  }

  // INSTANCE METHOD: Sign Data
  sign(data: any) {
    return this.keyPair.sign(createHash(data));
  }
}
