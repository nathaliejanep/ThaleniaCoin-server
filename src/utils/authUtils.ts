import { Response } from 'express';
import { IUser } from '../interfaces/IUser.js';

const sendToken = async (user: IUser, statusCode: number, res: Response) => {
  try {
    const token = await user.generateAuthToken();
    res.status(statusCode).json({ success: true, statusCode, token });
  } catch (err) {
    // FIXME: middleware error
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: 'Token generation failed' });
  }
};

export { sendToken };
