import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../models/BaseErrorModel.js';
import User from '../models/UserModel.js';
import asyncHandler from './asyncHandler.js';
import jwt from 'jsonwebtoken';

const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith('Bearer')) {
      token = authHeader.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_KEY as string);

      if (typeof decoded === 'string') {
        throw new Error('Token verification failed'); // or handle as needed
      }

      req.currentUser = await User.findById(decoded.id);
    } else if (!token || !req.currentUser) {
      next(new BaseError('Not Authorized', 401));
    }

    next();
  }
);

// TODO - change any
const restrict = (...allowedRoles: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.currentUser;

    if (!allowedRoles.includes(role)) {
      return next(new BaseError(`The role ${role} is not Authorized`, 401));
    }
    next();
  };
};

export { protect, restrict };
// req.currentUser = await User.findById(decoded.id).select('-password');
