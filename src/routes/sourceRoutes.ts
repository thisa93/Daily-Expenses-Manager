import express from 'express';
import { getSources, addSource, renderAddSource, renderEditSource, editSource } from '../controllers/sourceController.js';

const router = express.Router();

// protect middleware? yes, need to ensure user is logged in.
// I haven't created a protect middleware yet, I'll add a simple check inline or properly later. 
// For now assuming app.ts handles global auth check or I add it here.
// Let's create a middleware file actually.

import { protect } from '../middlewares/authMiddleware.js';

router.get('/', protect, getSources);
router.get('/add', protect, renderAddSource);
router.post('/add', protect, addSource);
router.get('/edit/:id', protect, renderEditSource);
router.post('/edit/:id', protect, editSource);

export default router;
