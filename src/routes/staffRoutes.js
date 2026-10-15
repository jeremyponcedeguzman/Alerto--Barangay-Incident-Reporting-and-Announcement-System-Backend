import express from 'express';
import {
  getStaff,
  addStaff,
  updateStaff,
  deleteStaff,
} from '../controllers/staffController.js';

const router = express.Router();

router.route('/')
  .get(getStaff)
  .post(addStaff);

router.route('/:id')
  .patch(updateStaff)
  .put(updateStaff)
  .delete(deleteStaff);

export default router;
