import { time } from 'console';
import mongoose, { Schema } from 'mongoose';
import IBlock from '../interfaces/IBlock.js';

const TransactionSchema = new Schema({
  // sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: String,
  recipient: { type: String, required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Transaction', TransactionSchema);
