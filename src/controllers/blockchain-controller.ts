import { Request, Response, NextFunction } from 'express';
import { blockchain, pubnub } from '../server.js';
import { BaseError, NotFoundError } from '../models/BaseErrorModel.js';

// const mineBlock = (req: Request, res: Response, next: NextFunction) => {
//   const { data } = req.body;
//   const block = blockchain.createBlock({ data });

//   res.status(201).json({ success: true, statusCode: 201, data: block });

//   pubnub.broadcast();

//   try {
//   } catch (err) {
//     next(new BaseError(`Error adding block: ${req.body}`, 500));
//   }
// };

const getBlockById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // RECHECK  index, or id???
    const { id } = req.params;
    const block = blockchain.chain.find((block) => block.index === +id);

    if (block) {
      res.status(200).json({ success: true, statusCode: 200, data: block });
    } else {
      // TODO check if next works like this, maybe if else is redundant
      next(new NotFoundError(id));
    }
  } catch (err) {
    next(new BaseError(`Error getting block: ${req.body}`, 500));
  }
};

// RECHECK not sure we need this?
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
        // pendingTransactions: blockchain.pendingTransactions,
      },
    });
  } catch (err) {
    next(new BaseError(`Error getting blockchain`, 500));
  }
};

export { getBlockById, getLastBlock, getBlockchain };
