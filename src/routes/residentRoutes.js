import express from 'express';
import {
  getResidents,
  getResidentById,
  addResident,
  updateResident,
  deleteResident,
  getResidentStats,
} from '../controllers/residentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All resident directory operations require official authentication
router.use(protect);

router.get('/', getResidents);
router.get('/stats/demographics', getResidentStats);
router.get('/:id', getResidentById);
router.post('/', authorize('Admin', 'Barangay Official'), addResident);
router.put('/:id', authorize('Admin', 'Barangay Official'), updateResident);
router.delete('/:id', authorize('Admin'), deleteResident);

export default router;
