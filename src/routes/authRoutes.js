import express from 'express';
import {
  register,
  login,
  getMe,
  getOfficials,
  changePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/officials', protect, getOfficials);
router.put('/password', protect, changePassword);

export default router;
