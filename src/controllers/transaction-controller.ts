import { Request, Response, NextFunction } from 'express';
import { BaseError, NotFoundError } from '../models/BaseErrorModel.js';
import Transaction from '../models/Transaction.js';
import { blockchain, pubnub, transactionPool, wallet } from '../server.js';
import Wallet from '../models/Wallet.js';
import Miner from '../models/Miner.js';
import asyncHandler from '../middleware/asyncHandler.js';
import TransactionModel from '../models/TransactionModel.js';

// const { publicKey } = req.currentUser;

// if (!publicKey) {
//   return res.status(401).json({ error: 'Unauthorized' });
// }

// // FIXME should this be inside try or not?
// if (!amount || !recipient) {
//   return res
//     .status(400)
//     .json({ error: 'Transaction details are incomplete' });
// }
const createTransaction = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { amount, recipient } = req.body;

    //   // TODO
    //   // pubnub.broadcastTransaction(transaction);

    let tx = transactionPool.transactionExist({
      address: wallet.publicKey,
    });

    try {
      if (tx) {
        tx.update({ sender: wallet, recipient, amount });
      } else {
        tx = wallet.createTransaction({ recipient, amount });
      }
    } catch (err) {
      next(new BaseError(`Error creating transaction`, 400));
    }
    console.log('-------TX', tx);
    transactionPool.addTransaction(tx);
    pubnub.broadcastTransaction(tx);

    // const txModel = new TransactionModel(tx);
    // await txModel.save();
    res.status(201).json({ success: true, statusCode: 201, data: tx });
  }
);

const getTransactionPool = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = transactionPool.transactionMap;

    res.status(200).json({
      success: true,
      statusCode: 200,
      data,
    });
  } catch (error) {
    console.error('Error fetching transaction pool:', error);
    next(new BaseError('Failed to fetch transaction pool', 500));
  }
};

const getWalletBalance = (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = wallet.publicKey;
    const balance = Wallet.calculateBalance({
      chain: blockchain,
      address,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: { address, balance },
    });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      error: 'Failed to fetch wallet balance',
    });
  }
};

const mineTransactions = (req: Request, res: Response, next: NextFunction) => {
  try {
    const miner = new Miner({
      blockchain,
      transactionPool,
      wallet,
      pubnub,
    });

    miner.mineTransaction();

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: 'Mining transactions successful.',
    });
  } catch (error) {
    console.error('Error mining transactions:', error);
    next(new BaseError('Failed to mine transactions', 500));
  }
};

// --------------- OLD --------------- //
const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({
      success: true,
      statusCode: 201,
      // data: blockchain.pendingTransactions,
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

export {
  createTransaction,
  getTransactionPool,
  getWalletBalance,
  mineTransactions,
  getTransactions,
  getTransactionById,
};
