import { Request, Response, NextFunction } from 'express';
import { pubnub } from '../server.js';
import { BaseError } from '../models/BaseErrorModel.js';

const getNodes = (req: Request, res: Response, next: NextFunction) => {
  try {
    const nodes = pubnub.getNodes();
    res.status(200).json({ success: true, statusCode: 200, nodes });
  } catch (err) {
    next(new BaseError(`Error retrieving nodes: ${req.body}`, 500));
  }
};

export { getNodes };
