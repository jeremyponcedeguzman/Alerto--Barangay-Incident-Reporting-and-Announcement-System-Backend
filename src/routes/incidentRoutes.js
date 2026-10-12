import express from 'express';
import {
  reportIncident,
  getIncidents,
  getIncidentById,
  updateIncidentStatus,
  deleteIncident,
  getIncidentStats,
} from '../controllers/incidentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route: citizens/residents can report incidents without login
router.post('/', reportIncident);

// Protected routes: officials view, manage, and update response
router.get('/', protect, getIncidents);
router.get('/stats/overview', protect, getIncidentStats);
router.get('/:id', protect, getIncidentById);
router.patch(
  '/:id/status',
  protect,
  authorize('Admin', 'Barangay Official'),
  updateIncidentStatus
);
router.delete('/:id', protect, authorize('Admin'), deleteIncident);

export default router;
