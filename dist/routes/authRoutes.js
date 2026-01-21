import express from 'express';
import { registerUser, loginUser, logoutUser, renderRegister, renderLogin } from '../controllers/authController.js';
const router = express.Router();
router.get('/register', renderRegister);
router.post('/register', registerUser);
router.get('/login', renderLogin);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
export default router;
