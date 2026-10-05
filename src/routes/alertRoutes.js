import express from 'express';
import {
  getAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  deleteAlert,
  getActiveAlerts,
} from '../controllers/alertController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes for residents and public bulletin
router.get('/', getAlerts);
router.get('/active', getActiveAlerts);
router.get('/:id', getAlertById);

// Protected routes for Barangay officials & Admin
router.post('/', protect, authorize('Admin', 'Barangay Official'), createAlert);
router.put('/:id', protect, authorize('Admin', 'Barangay Official'), updateAlert);
router.delete('/:id', protect, authorize('Admin'), deleteAlert);

export default router;
