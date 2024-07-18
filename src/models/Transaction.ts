import { v4 as uuidv4 } from 'uuid';
import {
  IInput,
  IOutputMap,
  ISender,
  ITransaction,
  ITransactionDetails,
} from '../interfaces/ITransactions.js';
import { MINING_REWARD, REWARD_ADDRESS } from '../config/settings.js';
import { verifySignature } from '../utils/crypto-lib.js';
// TYPE for whole
// RECHECK this or that
// class Transaction implements ITransaction {
class Transaction {
  id: string;
  outputMap: any;
  input: any;
  // outputMap: IOutputMap;
  // input: IInput;

  // RECHECK types for out and input

  constructor({
    sender,
    recipient,
    amount,
    outputMap,
    input,
  }: // }: ITransactionDetails) {
  any) {
    this.id = uuidv4();
    this.outputMap = outputMap || this.createMap({ sender, recipient, amount });
    this.input =
      input || this.createInput({ sender, outputMap: this.outputMap });
  }

  // Create reward transaction for miner
  // static transactionReward({ miner }: { miner: ISender }): Transaction {
  static transactionReward({ miner }: { miner: any }) {
    return new this({
      input: REWARD_ADDRESS,
      outputMap: { [miner.publicKey]: MINING_REWARD }, // Set this to give the REWARD to miner
    });
  }

  static validate(transaction: ITransaction): boolean {
    const {
      input: { address, amount, signature },
      outputMap,
    } = transaction;

    const outputTotal = Object.values(outputMap).reduce(
      (total, amount) => total + amount
      // 0 - RECHECK if we need
    );

    if (amount !== outputTotal) {
      return false;
    }

    if (!verifySignature({ publicKey: address, data: outputMap, signature })) {
      return false;
    }

    return true;
  }

  // TYPE ISender??
  update({
    sender,
    recipient,
    amount,
  }: {
    sender: any;
    recipient: string;
    amount: number;
  }): void {
    if (amount > this.outputMap[sender.publicKey])
      throw new Error('Not enough funds!');
    // RECHECK if logics
    if (!this.outputMap[recipient]) {
      this.outputMap[recipient] = amount;
    } else {
      this.outputMap[recipient] = this.outputMap[recipient] + amount;
    }

    this.outputMap[sender.publicKey] =
      this.outputMap[sender.publicKey] - amount;

    this.input = this.createInput({ sender, outputMap: this.outputMap });
  }

  // TODO make private if works
  // Creates outputMap for 'regular' transactions
  createMap({
    sender,
    recipient,
    amount,
  }: {
    sender: any;
    recipient: any;
    amount: any;
    // sender: ISender;
    // recipient: string;
    // amount: number;
  }): IOutputMap {
    const outputMap: IOutputMap = {};

    outputMap[recipient] = amount;
    outputMap[sender.publicKey] = sender.balance - amount;
    return outputMap;
  }

  // Creates input for 'regular' transactions
  createInput({
    sender,
    outputMap,
  }: {
    sender: any;
    outputMap: any;
    // sender: ISender;
    // outputMap: IOutputMap;
  }): IInput {
    return {
      timestamp: Date.now(),
      amount: sender.balance,
      address: sender.publicKey,
      signature: sender.sign(outputMap),
    };
  }
}

export default Transaction;
