// TODO: add interface

class Transaction {
  sender;
  reciever;
  amount;
  timestamp;

  constructor(
    sender: string,
    reciever: string,
    amount: number,
    timestamp: string
  ) {
    this.sender = sender;
    this.reciever = reciever;
    this.amount = amount;
    this.timestamp = Date.now();
  }
}

export default Transaction;
