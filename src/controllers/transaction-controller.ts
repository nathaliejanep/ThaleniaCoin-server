import { Request, Response, NextFunction } from 'express';
import { BaseError, NotFoundError } from '../models/BaseErrorModel.js';
import Transaction from '../models/Transaction.js';
import { blockchain } from '../server.js';

const createTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { amount, recipient } = req.body;

  const { publicKey } = req.currentUser;

  if (!publicKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!amount || !recipient) {
    return res
      .status(400)
      .json({ error: 'Transaction details are incomplete' });
  }

  try {
    const newTx = new Transaction({
      amount,
      sender: publicKey,
      recipient,
    });

    blockchain.addTransaction(newTx);
    res.status(201).json({ success: true, statusCode: 201, data: newTx });
  } catch (err) {
    next(new BaseError(`Error creating transaction`, 500));
  }
};

const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({
      success: true,
      statusCode: 201,
      data: blockchain.pendingTransactions,
    });
  } catch (err) {
    next(new BaseError(`Error getting transactions`, 500));
  }
};

const getTransactionById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    let transaction;

    for (let block of blockchain.chain) {
      return (transaction = block.data.find((tx) => tx.id === id));
    }

    res.status(200).json({ success: true, statusCode: 200, data: transaction });
  } catch (err) {
    next(new NotFoundError(`Transaction Id`));
  }
};

export { createTransaction, getTransactions, getTransactionById };
