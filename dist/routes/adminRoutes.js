import express from 'express';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
import { getAdminDashboard, toggleUserStatus, renderAddAdmin, addAdmin } from '../controllers/adminController.js';
const router = express.Router();
// Protect all routes
router.use(protect);
router.use(isAdmin);
router.get('/dashboard', getAdminDashboard);
router.post('/users/:id/toggle-status', toggleUserStatus);
router.get('/add', renderAddAdmin);
router.post('/add', addAdmin);
export default router;
