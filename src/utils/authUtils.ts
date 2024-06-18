import { Response } from 'express';
import { IUser } from '../interfaces/IUser.js';

const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = user.generateAuthToken();
  res.status(statusCode).json({ success: true, statusCode, token });
};

export { sendToken };
