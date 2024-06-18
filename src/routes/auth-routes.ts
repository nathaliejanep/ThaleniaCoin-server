import express from 'express';
import {
  getMe,
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
} from '../controllers/auth-controllers.js';
import { protect, restrict } from '../middleware/auth.security.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getme', protect, getMe);
router.post('/resetPassword', resetPassword);
router.post('/requestResetPassword', requestPasswordReset);

export default router;
