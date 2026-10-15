import express from 'express';
import {
  reportIncident,
  getIncidents,
  getIncidentById,
  updateIncident,
  updateIncidentStatus,
  deleteIncident,
  getIncidentStats,
} from '../controllers/incidentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes: incident reporting with live photo & map view
router.post('/', upload.single('image'), reportIncident);
router.get('/', getIncidents);
router.get('/stats/overview', getIncidentStats);
router.get('/:id', getIncidentById);

// Protected routes: officials update and manage incidents
router.patch('/:id', protect, authorize('Admin', 'admin', 'Barangay Official', 'official'), updateIncident);
router.patch(
  '/:id/status',
  protect,
  authorize('Admin', 'admin', 'Barangay Official', 'official'),
  updateIncidentStatus
);
router.delete('/:id', protect, authorize('Admin', 'admin'), deleteIncident);

export default router;
