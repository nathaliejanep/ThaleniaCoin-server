import { Request, Response, NextFunction } from 'express';
import {
  BaseError,
  SyntaxError,
  ValidationError,
} from '../models/BaseErrorModel.js';

// error handler middleware
const ErrorHandler = (
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errMessage = err.message || 'Something went wrong';
  const errStatus = err.status || 500;
  const urlPath = req.path;

  const customError: boolean =
    err.constructor.name === 'NodeError' ||
    err.constructor.name === 'SyntaxError'
      ? false
      : true;

  if (err instanceof ValidationError) {
    return res.status(errStatus).json({
      status: errStatus,
      message: errMessage,
      data: err.errorData,
    });
  }
  if (err instanceof SyntaxError) {
    return res.status(errStatus).json({
      status: errStatus,
      message: errMessage,
      data: err.errorData,
    });
  }
  if (err instanceof BaseError) {
    // if (err.isOperational) {
    //   return res.status(err.status).json({
    //     status: err.status < 500 && err.status >= 400 ? 'fail' : 'error',
    //     message: err.message,
    //   });
    //   //
    // }
    // log the error
    // send generic error message
    return res.status(errStatus).send({
      type: customError === false ? 'UnhandledError' : err.constructor.name,
      status: errStatus,
      message: errMessage,
      urlPath,
    });
  }
};

export default ErrorHandler;
