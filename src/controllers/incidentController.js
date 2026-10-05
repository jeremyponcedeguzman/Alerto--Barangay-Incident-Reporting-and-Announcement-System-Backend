import Incident from '../models/Incident.js';

// @desc    Submit an emergency incident report (Residents / Citizens)
// @route   POST /api/incidents
// @access  Public
export const reportIncident = async (req, res, next) => {
  try {
    const {
      incidentType,
      purok,
      exactLocation,
      description,
      reporterName,
      reporterContact,
      urgency,
    } = req.body;

    const incident = await Incident.create({
      incidentType,
      purok,
      exactLocation,
      description,
      reporterName: reporterName || 'Anonymous Resident',
      reporterContact: reporterContact || '',
      urgency: urgency || 'Medium',
    });

    res.status(201).json({
      success: true,
      message: 'Incident report submitted successfully. Barangay responders have been notified.',
      data: incident,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all incident reports (Dashboard view)
// @route   GET /api/incidents
// @access  Private (Officials & Admin)
export const getIncidents = async (req, res, next) => {
  try {
    const { status, urgency, purok } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (urgency) filter.urgency = urgency;
    if (purok) filter.purok = purok;

    const incidents = await Incident.find(filter)
      .populate('respondedBy', 'fullName position')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: incidents.length,
      data: incidents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single incident report
// @route   GET /api/incidents/:id
// @access  Private
export const getIncidentById = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id).populate(
      'respondedBy',
      'fullName position contactNumber'
    );

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident report not found',
      });
    }

    res.status(200).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update incident status and action taken
// @route   PATCH /api/incidents/:id/status
// @access  Private (Officials & Admin)
export const updateIncidentStatus = async (req, res, next) => {
  try {
    const { status, actionTakenNotes } = req.body;

    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident report not found',
      });
    }

    if (status) incident.status = status;
    if (actionTakenNotes !== undefined) incident.actionTakenNotes = actionTakenNotes;
    incident.respondedBy = req.user._id;

    await incident.save();

    res.status(200).json({
      success: true,
      message: 'Incident status updated successfully',
      data: incident,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete incident report
// @route   DELETE /api/incidents/:id
// @access  Private (Admin only)
export const deleteIncident = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident report not found',
      });
    }

    await incident.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Incident report deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get incident statistics for dashboard cards
// @route   GET /api/incidents/stats/overview
// @access  Private
export const getIncidentStats = async (req, res, next) => {
  try {
    const total = await Incident.countDocuments();
    const pending = await Incident.countDocuments({ status: 'Pending' });
    const verified = await Incident.countDocuments({ status: 'Verified' });
    const responding = await Incident.countDocuments({ status: 'Responding' });
    const resolved = await Incident.countDocuments({ status: 'Resolved' });

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        verified,
        responding,
        resolved,
      },
    });
  } catch (error) {
    next(error);
  }
};
