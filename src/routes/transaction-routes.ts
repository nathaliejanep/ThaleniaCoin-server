import express from 'express';
import {
  createTransaction,
  getTransactionById,
  getTransactionPool,
  getTransactions,
  getWalletBalance,
  mineTransactions,
} from '../controllers/transaction-controller.js';
import { protect } from '../middleware/auth.security.js';

const router = express.Router();

router.post('/add', protect, createTransaction);
router.get('/balance', getWalletBalance);
router.get('/pending', getTransactionPool);
router.get('/mine', mineTransactions);
// ----------- OLD ---------- //
router.get('/', getTransactions);
// router.post('/add', protect, createTransaction); //FIXME protect
// router.get('/:id', getTransactionById);
export default router;
