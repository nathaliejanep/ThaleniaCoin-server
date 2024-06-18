import { User } from './src/models/UserModel.ts';
declare global {
  namespace Express {
    interface Request {
      currentUser: User;
    }
  }
}
