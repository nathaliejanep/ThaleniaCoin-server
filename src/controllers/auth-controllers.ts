import asyncHandler from '../middleware/asyncHandler.js';
import { Request, Response, NextFunction } from 'express';
import User from '../models/UserModel.js';
import { sendToken } from '../utils/authUtils.js';
import { BaseError } from '../models/BaseErrorModel.js';
import Token from '../models/token.model.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import Wallet from '../models/Wallet.js';

const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return next(new BaseError('Please enter all required fields', 400));
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new BaseError('Email is already registered', 400));
    }

    if (password.length < 8) {
      return next(
        new BaseError('Password must be at least 8 characters long', 400)
      );
    }
    const userWallet = new Wallet();
    const { publicKey } = userWallet;

    const newUser = await User.create({
      name,
      email,
      password,
      role,
      publicKey,
    });
    sendToken(newUser, 201, res);
  }
);

// TODO check if error is shown for user that password not long enough etc
const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new BaseError('Email or password is missing', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (user) {
      const isValid = await user.validatePassword(password);

      !isValid
        ? next(new BaseError('Incorrect email and/or password', 401))
        : await sendToken(user, 200, res);

      req.currentUser = user;

      console.log(user);
    }
  }
);

const getMe = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.currentUser;

    if (!id) {
      return next(new BaseError(`User ID: ${id}, not found.`, 400));
    }

    const user = await User.findById(id);

    if (!user) {
      return next(new BaseError(`User not found.`, 404));
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: user,
    });
  }
);

const requestPasswordReset = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      return next(new BaseError('Email is missing.', 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new BaseError(`${email} is not registered.`, 400));
    }

    let token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();
    let resetToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(resetToken, Number(process.env.BCRYPT_SALT));

    await new Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const link = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/resetPassword?token=${resetToken}&id=${user._id}`;

    //TODO - Send email IRL
    sendEmail({
      recipient: user.email,
      subject: 'Password Reset Request',
      message: `Use this link to reset your password: ${link}`,
    });

    return res.status(201).json(link);
  }
);

const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, id } = req.query;
    const { password } = req.body;

    const passwordResetToken = await Token.findOne({
      userId: id,
    });

    if (!passwordResetToken) {
      next(new BaseError('Invalid or expired reset token', 400));
    }
    // OPTIMIZE - Keep it DRY, using this in user.model too
    const isValid = await bcrypt.compare(
      token as string,
      passwordResetToken?.token as string
    );

    !isValid && next(new BaseError('Invalid or expired reset token', 400));

    // OPTIMIZE - Keep it DRY, might be using this in other files
    const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));

    await User.updateOne(
      { _id: id },
      { $set: { password: hash } },
      { new: true }
    );

    //TODO - Send email

    await passwordResetToken?.deleteOne();

    return res.status(201).json({ message: 'Password was succesfully reset' });
  }
);

// TODO - Update User
// TODO - Update Password

export { getMe, loginUser, registerUser, resetPassword, requestPasswordReset };
