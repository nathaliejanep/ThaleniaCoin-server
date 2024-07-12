import express from 'express';
import { getNodes } from '../controllers/pubnub-controller.js';

const router = express.Router();

router.route('/').get(getNodes);
export default router;
