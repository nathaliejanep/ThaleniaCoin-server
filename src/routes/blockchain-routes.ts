import express from 'express';
import {
  addBlock,
  getBlockById,
  getBlockchain,
} from '../controllers/blockchain-controller.js';

const router = express.Router();

router.route('/').get(getBlockchain);
router.route('/:id').get(getBlockById);
router.route('/mine').post(addBlock);
// TODO add consensus

export default router;
