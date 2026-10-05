import Alert from '../models/Alert.js';

// @desc    Get all alerts (with filter by status, type, severity)
// @route   GET /api/alerts
// @access  Public
export const getAlerts = async (req, res, next) => {
  try {
    const { status, severity, type, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const alerts = await Alert.find(filter)
      .populate('issuedBy', 'fullName position')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single alert by ID
// @route   GET /api/alerts/:id
// @access  Public
export const getAlertById = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id).populate(
      'issuedBy',
      'fullName position contactNumber'
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Emergency alert not found',
      });
    }

    res.status(200).json({
      success: true,
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new emergency alert
// @route   POST /api/alerts
// @access  Private (Barangay Official / Admin)
export const createAlert = async (req, res, next) => {
  try {
    const { title, type, severity, description, instructions, targetPuroks, expiresAt } =
      req.body;

    const alert = await Alert.create({
      title,
      type,
      severity,
      description,
      instructions,
      targetPuroks: targetPuroks || ['All Puroks'],
      issuedBy: req.user._id,
      issuerName: req.user.fullName,
      expiresAt: expiresAt || null,
    });

    res.status(201).json({
      success: true,
      message: 'Emergency alert published successfully',
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update alert (e.g. resolve, update advisory)
// @route   PUT /api/alerts/:id
// @access  Private (Barangay Official / Admin)
export const updateAlert = async (req, res, next) => {
  try {
    let alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Emergency alert not found',
      });
    }

    alert = await Alert.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Emergency alert updated successfully',
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete alert
// @route   DELETE /api/alerts/:id
// @access  Private (Admin only)
export const deleteAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Emergency alert not found',
      });
    }

    await alert.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Emergency alert deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active alerts for emergency banner/ticker
// @route   GET /api/alerts/active
// @access  Public
export const getActiveAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.find({ status: 'Active' })
      .sort({ severity: -1, createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};
