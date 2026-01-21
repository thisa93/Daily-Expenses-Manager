import express from 'express';
import { addTransaction, renderAddTransaction } from '../controllers/transactionController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/add', protect, renderAddTransaction);
router.post('/add', protect, addTransaction);

export default router;
