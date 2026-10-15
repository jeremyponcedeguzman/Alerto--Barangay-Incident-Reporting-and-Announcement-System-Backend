import Incident from '../models/Incident.js';
import { uploadImage, deleteImage } from '../utils/cloudinaryUploader.js';

const RESPONDER_MAP = {
  fire: 'BFP (Bureau of Fire Protection) 🚒',
  flood: 'DRRMO (Disaster Risk Reduction) 🌊',
  medical: 'BHERT (Barangay Health / Ambulance) 🚑',
  police: 'Barangay Tanod & PNP 👮',
  accident: 'Traffic Enforcement & Tanod ⚠️',
  hazard: 'Barangay Engineering & Meralco ⚡',
};

// @desc    Submit an emergency incident report (with Cloudinary photo upload)
// @route   POST /api/incidents
// @access  Public
export const reportIncident = async (req, res, next) => {
  try {
    const {
      title,
      category,
      severity,
      locationName,
      lat,
      lng,
      reportedBy,
      imageEvidence,
      responder,
      incidentType,
      purok,
      exactLocation,
      description,
      reporterName,
      reporterContact,
      urgency,
    } = req.body;

    const finalCategory = (category || incidentType || 'flood').toLowerCase();
    const finalLocation = locationName || exactLocation || purok || 'Barangay Anupul';
    const finalTitle = title || `${finalCategory.toUpperCase()} Report at ${finalLocation}`;
    const finalReporter = reportedBy || reporterName || 'Anonymous Resident';
    const finalResponder = responder || RESPONDER_MAP[finalCategory] || 'Barangay Operations Desk';

    // Handle Cloudinary upload if an image was provided
    let finalImageUrl = '';
    let cloudinaryPublicId = '';

    const rawImage = req.file ? req.file.buffer : imageEvidence;
    if (rawImage) {
      const uploadRes = await uploadImage(rawImage, 'barangay-emergency/incidents');
      finalImageUrl = uploadRes.url;
      cloudinaryPublicId = uploadRes.publicId;
    }

    const count = await Incident.countDocuments();
    const customId = `INC-2026-${String(count + 1).padStart(3, '0')}`;

    const incident = await Incident.create({
      customId,
      title: finalTitle,
      category: finalCategory,
      incidentType: incidentType || 'Other',
      severity: severity || (urgency ? urgency.toLowerCase() : 'medium'),
      urgency: urgency || 'Medium',
      locationName: finalLocation,
      purok: purok || finalLocation,
      exactLocation: exactLocation || finalLocation,
      lat: lat ? Number(lat) : 15.2894,
      lng: lng ? Number(lng) : 120.5718,
      description,
      reportedBy: finalReporter,
      reporterName: finalReporter,
      reporterContact: reporterContact || '',
      imageEvidence: finalImageUrl,
      cloudinaryPublicId,
      responder: finalResponder,
      status: 'Pending',
      votes: 1,
      isUserReport: true,
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
// @access  Public / Private
export const getIncidents = async (req, res, next) => {
  try {
    const { status, urgency, severity, purok, category, search } = req.query;
    const filter = {};

    if (status && status !== 'all') filter.status = status;
    if (urgency && urgency !== 'all') filter.urgency = urgency;
    if (severity && severity !== 'all') filter.severity = severity.toLowerCase();
    if (category && category !== 'all') filter.category = category.toLowerCase();
    if (purok && purok !== 'all') filter.purok = purok;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { locationName: { $regex: search, $options: 'i' } },
        { reportedBy: { $regex: search, $options: 'i' } },
      ];
    }

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
// @access  Public / Private
export const getIncidentById = async (req, res, next) => {
  try {
    const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const incident = await Incident.findOne({
      $or: [{ _id: isObjectId ? req.params.id : null }, { customId: req.params.id }],
    }).populate('respondedBy', 'fullName position contactNumber');

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

// @desc    Update incident details (status, responder, notes, or incident information)
// @route   PATCH /api/incidents/:id
// @access  Public / Private
export const updateIncident = async (req, res, next) => {
  try {
    const {
      status,
      actionTakenNotes,
      responder,
      votes,
      title,
      category,
      severity,
      urgency,
      locationName,
      exactLocation,
      purok,
      lat,
      lng,
      description,
      imageEvidence,
    } = req.body;

    const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const incident = await Incident.findOne({
      $or: [{ _id: isObjectId ? req.params.id : null }, { customId: req.params.id }],
    });

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident report not found',
      });
    }

    if (status !== undefined) incident.status = status;
    if (responder !== undefined) incident.responder = responder;
    if (votes !== undefined) incident.votes = votes;
    if (actionTakenNotes !== undefined) incident.actionTakenNotes = actionTakenNotes;
    if (title !== undefined) incident.title = title;
    if (category !== undefined) incident.category = category;
    if (severity !== undefined) incident.severity = severity;
    if (urgency !== undefined) incident.urgency = urgency;
    if (locationName !== undefined) incident.locationName = locationName;
    if (exactLocation !== undefined) incident.exactLocation = exactLocation;
    if (purok !== undefined) incident.purok = purok;
    if (lat !== undefined) incident.lat = Number(lat);
    if (lng !== undefined) incident.lng = Number(lng);
    if (description !== undefined) incident.description = description;
    if (imageEvidence !== undefined) incident.imageEvidence = imageEvidence;
    if (req.user) incident.respondedBy = req.user._id;

    await incident.save();

    res.status(200).json({
      success: true,
      message: 'Incident updated successfully',
      data: incident,
    });
  } catch (error) {
    next(error);
  }
};

// Backwards compatibility alias
export const updateIncidentStatus = updateIncident;

// @desc    Delete incident report (and clean up Cloudinary photo)
// @route   DELETE /api/incidents/:id
// @access  Private (Admin only)
export const deleteIncident = async (req, res, next) => {
  try {
    const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const incident = await Incident.findOne({
      $or: [{ _id: isObjectId ? req.params.id : null }, { customId: req.params.id }],
    });

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident report not found',
      });
    }

    // Clean up photo on Cloudinary if present
    if (incident.cloudinaryPublicId) {
      await deleteImage(incident.cloudinaryPublicId);
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
// @access  Public / Private
export const getIncidentStats = async (req, res, next) => {
  try {
    const total = await Incident.countDocuments();
    const pending = await Incident.countDocuments({ status: { $in: ['Pending', 'Pending Review'] } });
    const verified = await Incident.countDocuments({ status: { $in: ['Verified', 'Dispatched'] } });
    const responding = await Incident.countDocuments({ status: { $in: ['Responding', 'In Progress'] } });
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
