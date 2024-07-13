import { time } from 'console';
import mongoose, { Schema } from 'mongoose';
import IBlock from '../interfaces/IBlock.js';

const TransactionSchema = new Schema({
  sender: String,
  recipient: String,
  amount: Number,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Transaction', TransactionSchema);
