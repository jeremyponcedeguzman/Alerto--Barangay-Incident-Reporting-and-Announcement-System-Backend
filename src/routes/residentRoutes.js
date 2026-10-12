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

<<<<<<< HEAD
// Public route: resident self-registration (must come BEFORE router.use(protect))
router.post('/register', addResident);

// All subsequent resident directory operations require official authentication
=======
// All resident directory operations require official authentication
>>>>>>> 2445b7fbef2844e9ec18ec6b35421943ec36b949
router.use(protect);

router.get('/', getResidents);
router.get('/stats/demographics', getResidentStats);
router.get('/:id', getResidentById);
router.post('/', authorize('Admin', 'Barangay Official'), addResident);
router.put('/:id', authorize('Admin', 'Barangay Official'), updateResident);
router.delete('/:id', authorize('Admin'), deleteResident);

<<<<<<< HEAD
export default router;
=======
export default router;
>>>>>>> 2445b7fbef2844e9ec18ec6b35421943ec36b949
