import Block from './Block.js';
import Transaction from './Transaction.js';
interface ITransactionMap {
  [id: string]: Transaction;
}

class TransactionPool {
  // transactionMap: Record<string, Transaction>;
  transactionMap: ITransactionMap;

  constructor() {
    this.transactionMap = {};
  }

  // TYPE Transaction
  addTransaction(transaction: any): void {
    this.transactionMap[transaction.id] = transaction;
  }

  clearBlockTransactions({ chain }: { chain: Block[] }) {
    for (let i = 1; i < chain.length; i++) {
      // Hämta ut ett block för varje iteration...
      const block = chain[i];

      // Gå igenom varje transaktion som finns i blocket...
      for (let transaction of block.data) {
        if (this.transactionMap[transaction.id]) {
          // Ta bort transaktion ifrån transactionMap om transaktion finns kvar...
          delete this.transactionMap[transaction.id];
        }
      }
    }
  }

  clearTransactions(): void {
    this.transactionMap = {};
  }

  replaceTransactionMap(transactionMap: ITransactionMap) {
    this.transactionMap = transactionMap;
  }

  // TYPE address
  transactionExist({ address }: any) {
    const transactions = Object.values(this.transactionMap);
    return transactions.find(
      (transaction) => transaction.input.address === address
    );
  }

  validateTransactions() {
    // REFACTOR return directly
    const validTransactions = Object.values(this.transactionMap).filter(
      (transaction) => Transaction.validate(transaction)
    );
    return validTransactions;
  }
}

export default TransactionPool;
