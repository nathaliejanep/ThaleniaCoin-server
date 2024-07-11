import { Request, Response, NextFunction } from 'express';
import { blockchain, pubnub } from '../server.js';
import { BaseError, NotFoundError } from '../models/BaseErrorModel.js';

const addBlock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await blockchain.createBlock();
    pubnub.broadcast();

    res.status(201).json({ success: true, statusCode: 201, data });
  } catch (err) {
    next(new BaseError(`Error adding block: ${req.body}`, 500));
  }
};

const getBlock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { index } = req.params;
    const block = blockchain.chain.find((block) => block.index === +index);

    if (block) {
      res.status(200).json({ success: true, statusCode: 200, data: block });
    } else {
      // TODO check if next works like this
      next(new NotFoundError(index));
    }
  } catch (err) {
    next(new BaseError(`Error getting block: ${req.body}`, 500));
  }
};

const getLastBlock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lastBlock = blockchain.chain[blockchain.chain.length - 1];

    res.status(200).json({ success: true, statusCode: 200, data: lastBlock });
  } catch (err) {
    next(new BaseError(`Error getting the last block`, 500));
  }
};

const getBlockchain = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        chain: blockchain.chain,
        pendingTransactions: blockchain.pendingTransactions,
      },
    });
  } catch (err) {
    next(new BaseError(`Error getting blockchain`, 500));
  }
};

export { addBlock, getBlock, getLastBlock, getBlockchain };
