import { v4 as uuidv4 } from 'uuid';

class Transaction {
  sender;
  recipient;
  amount;
  timestamp;
  // input,
  // output;
  id;
  constructor(details: any) {
    // constructor(sender:string, recipient:string, amount:number){
    this.amount = details.amount;
    this.sender = details.sender;
    this.recipient = details.recipient;
    this.timestamp = Date.now();
    // this.output = this.output||this.createMap({sender, recipient, amount});
    // this.input = this.input||this.createInput({sender, output:this.output});
    this.id = uuidv4();
  }
}

export default Transaction;
