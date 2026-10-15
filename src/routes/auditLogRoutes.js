import express from 'express';
import {
  getAuditLogs,
  createAuditLog,
  clearAuditLogs,
} from '../controllers/auditLogController.js';

const router = express.Router();

router.route('/')
  .get(getAuditLogs)
  .post(createAuditLog)
  .delete(clearAuditLogs);

export default router;
