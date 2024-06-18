import mongoose, { Schema } from 'mongoose';
import { IUser, IUserMethods, IUserModel } from '../interfaces/IUser.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { generateKeyPair } from '../utils/securityUtils.js';

const { publicKey, privateKey } = generateKeyPair();

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },

  email: {
    type: String,
    required: [true, 'Email adress is required'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
    trim: true,
    lowercase: true,
  },

  role: {
    type: String,
    enum: ['user', 'manager', 'admin'],
    default: 'user',
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 charachters'],
    // TODO - Add regex
    select: false,
  },

  publicKey: {
    type: String,
    default: publicKey,
  },

  privateKey: {
    type: String,
    default: privateKey,
  },

  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
  // TODO - Check how to use this
  authTokens: [
    {
      authToken: { type: String, required: true },
    },
  ],
  // lägg till dokument här?
});

UserSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }

  next();
});

UserSchema.methods.validatePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_KEY as string, {
    expiresIn: process.env.JWT_TTL,
  });

  this.authTokens = this.authTokens.concat({ authToken: token });

  await this.save(); // TODO - Check if we should do this
  return token;
};

// https://medium.com/@sherief.elsowiny/adding-password-reset-to-our-authentication-service-d0b5408a629e
// TODO - Test if that works if I have time
UserSchema.methods.generateResetPwToken = function () {
  const token = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.resetPasswordTokenExpire = new Date(Date.now() + 10 * 60 * 1000);

  return this.resetPasswordToken;
};
export default mongoose.model<IUser, IUserModel>('User', UserSchema);
