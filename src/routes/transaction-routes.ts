import express from 'express';
import {
  createTransaction,
  getTransactionById,
  getTransactions,
} from '../controllers/transaction-controller.js';

const router = express.Router();

router.route('/').get(getTransactions);
router.route('/:txId').get(getTransactionById);
router.route('/add').post(createTransaction);

export default router;
