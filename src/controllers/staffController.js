import Staff from '../models/Staff.js';

// @desc    Get all staff roster members
// @route   GET /api/staff
// @access  Public
export const getStaff = async (req, res, next) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new staff member
// @route   POST /api/staff
// @access  Public / Private
export const addStaff = async (req, res, next) => {
  try {
    const { name, role, category, shift, contact, isDuty, badge, id } = req.body;
    const staff = await Staff.create({
      customId: String(id || Date.now()),
      name,
      role,
      category: category || 'Official',
      shift: shift || 'Day (8:00 AM - 5:00 PM)',
      contact: contact || '0917-123-4567',
      isDuty: isDuty !== undefined ? isDuty : true,
      badge: badge || `STF-${Date.now()}`,
    });

    res.status(201).json({
      success: true,
      message: 'Staff member onboarded successfully',
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update staff member (duty status, shift, etc.)
// @route   PATCH /api/staff/:id
// @access  Public / Private
export const updateStaff = async (req, res, next) => {
  try {
    const id = req.params.id;
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);

    const staff = await Staff.findOneAndUpdate(
      { $or: [{ _id: isObjectId ? id : null }, { customId: id }, { badge: id }, { name: id }] },
      { $set: req.body },
      { returnDocument: 'after', runValidators: true }
    );

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Staff member updated successfully',
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete staff member
// @route   DELETE /api/staff/:id
// @access  Public / Private
export const deleteStaff = async (req, res, next) => {
  try {
    const id = req.params.id;
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);

    const staff = await Staff.findOneAndDelete({
      $or: [{ _id: isObjectId ? id : null }, { customId: id }, { badge: id }, { name: id }],
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Staff member removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
