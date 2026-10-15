import AuditLog from '../models/AuditLog.js';

// @desc    Get all audit logs (most recent first)
// @route   GET /api/audit-logs
// @access  Public / Private
export const getAuditLogs = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 200, 500);
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(limit);

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create an audit log entry
// @route   POST /api/audit-logs
// @access  Public / Private
export const createAuditLog = async (req, res, next) => {
  try {
    const { category, action, actor, target, details, severity, id } = req.body;
    const customId = id || `LOG-2026-${String(Date.now()).slice(-6)}`;

    const log = await AuditLog.create({
      customId,
      category: category || 'System',
      action,
      actor: actor || 'System',
      target: target || 'N/A',
      details: details || '',
      severity: severity || 'info',
    });

    res.status(201).json({
      success: true,
      data: log,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all audit logs
// @route   DELETE /api/audit-logs
// @access  Private
export const clearAuditLogs = async (req, res, next) => {
  try {
    await AuditLog.deleteMany({});
    res.status(200).json({
      success: true,
      message: 'Audit logs cleared successfully',
    });
  } catch (error) {
    next(error);
  }
};
