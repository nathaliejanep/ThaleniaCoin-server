import mongoose, { Schema } from 'mongoose';
import TransactionSchema from './TransactionModel.js';

const BlockSchema = new Schema({
  timestamp: { type: Number, required: true, default: Date.now },
  index: { type: Number, required: true },
  previousHash: { type: String, required: true, default: '' },
  hash: { type: String, required: true, default: '' },
  data: { type: [], required: true, default: [] }, // FIXME correct type
  nonce: { type: Number, required: true, default: 0 },
  difficulty: { type: Number, required: true, default: 1 },
});

export default mongoose.model('Block', BlockSchema);
