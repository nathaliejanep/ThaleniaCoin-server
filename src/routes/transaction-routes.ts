import express from 'express';
import {
  createTransaction,
  getTransactionById,
  getTransactions,
} from '../controllers/transaction-controller.js';
import { protect } from '../middleware/auth.security.js';

const router = express.Router();

router.get('/', getTransactions);
router.get('/:id', getTransactionById);
router.post('/add', protect, createTransaction);

export default router;
