import { Document, Model } from 'mongoose';

// TODO - Check if extends Document from mongoose is needed or not
interface IUser extends Document {
  name: string;
  email: string;
  role: string;
  password: string;
  publicKey: string;
  privateKey: string;
  resetPasswordToken: string;
  resetPasswordTokenExpire: Date;
  createdAt: Date;
  authTokens: { authToken: string }[];

  generateAuthToken(): Promise<string>;
  validatePassword(password: string): Promise<boolean>;
}

interface IUserMethods {
  // generateAuthToken(): Promise<string>;
}

interface IUserModel extends Model<IUser, {}, IUserMethods> {}

export { IUser, IUserMethods, IUserModel };
