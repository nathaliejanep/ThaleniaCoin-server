import { Request, Response, NextFunction } from 'express';
// req: Request, res: Response, next: NextFunction
const asyncHandler =
  (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
