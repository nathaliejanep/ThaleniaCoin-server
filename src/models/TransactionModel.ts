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

// import mongoose, { Schema, Document } from 'mongoose';

// export interface ITransaction extends Document {
//   input: {
//     timestamp: number;
//     amount: number;
//     address: string;
//     signature: {
//       r: any; // Adjust according to your actual signature structure
//       s: any; // Adjust according to your actual signature structure
//       recoveryParam: number;
//     };
//   };
//   outputMap: {
//     [key: string]: number; // Allows any string key with number values
//   };
// }

// const TransactionSchema: Schema = new Schema({
//   input: {
//     timestamp: { type: Number, required: true },
//     amount: { type: Number, required: true },
//     address: { type: String, required: true },
//     signature: {
//       r: { type: Schema.Types.Mixed }, // Adjust based on your actual signature structure
//       s: { type: Schema.Types.Mixed }, // Adjust based on your actual signature structure
//       recoveryParam: { type: Number, required: true },
//     },
//   },
//   outputMap: {
//     type: Map,
//     of: Number,
//     required: true,
//   },
// });

// const TransactionModel = mongoose.model<ITransaction>(
//   'Transaction',
//   TransactionSchema
// );

// export default TransactionModel;
