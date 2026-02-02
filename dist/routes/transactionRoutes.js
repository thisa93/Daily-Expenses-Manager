import express from 'express';
import { addTransaction, renderAddTransaction, deleteTransaction, renderEditTransaction, updateTransaction, getTransactionHistory } from '../controllers/transactionController.js';
import { protect } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.get('/', protect, getTransactionHistory); // New History Route at /transactions
router.get('/add', protect, renderAddTransaction);
router.post('/add', protect, addTransaction);
// Edit Transaction Route
router.get('/edit/:id', protect, renderEditTransaction);
router.post('/edit/:id', protect, updateTransaction);
// Delete Transaction Route
router.post('/delete/:id', protect, deleteTransaction);
// Month End Report Route
import { renderMonthEndReport } from '../controllers/transactionController.js';
router.get('/month-end-report', protect, renderMonthEndReport);
export default router;
