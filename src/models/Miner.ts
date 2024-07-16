import PubNubServer from '../pubnubServer.js';
import Blockchain from './Blockchain.js';
import Transaction from './Transaction.js';
import TransactionPool from './TransactionPool.js';
import Wallet from './Wallet.js';

interface MinerOptions {
  blockchain: Blockchain;
  wallet: Wallet;
  transactionPool: TransactionPool;
  pubnub: PubNubServer;
}

export default class Miner {
  blockchain: Blockchain;
  wallet: Wallet;
  transactionPool: TransactionPool;
  pubnub: PubNubServer;

  constructor({ blockchain, wallet, transactionPool, pubnub }: MinerOptions) {
    this.blockchain = blockchain;
    this.wallet = wallet;
    this.transactionPool = transactionPool;
    this.pubnub = pubnub;
  }

  mineTransaction(): void {
    // Get validTransactions from TransactionPool
    const validTransactions = this.transactionPool.validateTransactions();

    // Create Reward
    validTransactions.push(
      Transaction.transactionReward({ miner: this.wallet })
    );

    // Create block with valid transactions and put in chain
    this.blockchain.createBlock({ data: validTransactions });
    this.pubnub.broadcast();

    this.transactionPool.clearTransactions();
  }
}
