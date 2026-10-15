import Resident from '../models/Resident.js';
import User from '../models/User.js';

// @desc    Get all residents (with filter and search)
// @route   GET /api/residents
// @access  Private (Officials & Admin)
export const getResidents = async (req, res, next) => {
  try {
    const { purok, search, vulnerable } = req.query;
    const filter = {};

    if (purok) filter.purok = purok;
    if (vulnerable === 'true') {
      filter.$or = [{ isSeniorCitizen: true }, { isPWD: true }];
    }
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { contactNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const residents = await Resident.find(filter).sort({ purok: 1, fullName: 1 });

    res.status(200).json({
      success: true,
      count: residents.length,
      data: residents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resident by ID
// @route   GET /api/residents/:id
// @access  Private
export const getResidentById = async (req, res, next) => {
  try {
    const resident = await Resident.findById(req.params.id);

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: 'Resident record not found',
      });
    }

    res.status(200).json({
      success: true,
      data: resident,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new resident in emergency contact list
// @route   POST /api/residents
// @access  Private
export const addResident = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (email && typeof email === 'string' && email.trim()) {
      const cleanEmail = email.trim().toLowerCase();
      
      const existingResident = await Resident.findOne({ email: cleanEmail });
      if (existingResident) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists in the resident directory.',
        });
      }

      const existingOfficial = await User.findOne({ email: cleanEmail });
      if (existingOfficial) {
        return res.status(400).json({
          success: false,
          message: 'An official account with this email address already exists.',
        });
      }

      req.body.email = cleanEmail;
    }

    const resident = await Resident.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Resident registered to emergency notification directory',
      data: resident,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }
    next(error);
  }
};

// @desc    Update resident details
// @route   PUT /api/residents/:id
// @access  Private
export const updateResident = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (email && typeof email === 'string' && email.trim()) {
      const cleanEmail = email.trim().toLowerCase();

      const duplicateResident = await Resident.findOne({
        email: cleanEmail,
        _id: { $ne: req.params.id },
      });
      if (duplicateResident) {
        return res.status(400).json({
          success: false,
          message: 'Another resident account is already registered with this email address.',
        });
      }

      const duplicateOfficial = await User.findOne({ email: cleanEmail });
      if (duplicateOfficial) {
        return res.status(400).json({
          success: false,
          message: 'An official account is already registered with this email address.',
        });
      }

      req.body.email = cleanEmail;
    }

    const resident = await Resident.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: 'Resident record not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resident record updated successfully',
      data: resident,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }
    next(error);
  }
};

// @desc    Delete resident from directory
// @route   DELETE /api/residents/:id
// @access  Private (Admin only)
export const deleteResident = async (req, res, next) => {
  try {
    const resident = await Resident.findById(req.params.id);

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: 'Resident record not found',
      });
    }

    await resident.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Resident removed from emergency directory',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get summary breakdown by purok for disaster preparedness
// @route   GET /api/residents/stats/demographics
// @access  Private
export const getResidentStats = async (req, res, next) => {
  try {
    const totalResidents = await Resident.countDocuments();
    const seniorCitizens = await Resident.countDocuments({ isSeniorCitizen: true });
    const pwds = await Resident.countDocuments({ isPWD: true });

    // Group by purok
    const purokBreakdown = await Resident.aggregate([
      {
        $group: {
          _id: '$purok',
          total: { $sum: 1 },
          seniors: { $sum: { $cond: ['$isSeniorCitizen', 1, 0] } },
          pwds: { $sum: { $cond: ['$isPWD', 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalResidents,
        seniorCitizens,
        pwds,
        purokBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};
