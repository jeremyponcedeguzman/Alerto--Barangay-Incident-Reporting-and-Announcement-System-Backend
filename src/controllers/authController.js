import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// @desc    Register new Barangay official/admin
// @route   POST /api/auth/register
// @access  Public (or can be restricted to Admin)
export const register = async (req, res, next) => {
  try {
    const { fullName, email, password, role, position, contactNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists',
      });
    }

    // Auto-promote first registered user to Admin
    const userCount = await User.countDocuments();
    const assignedRole = userCount === 0 ? 'Admin' : (role || 'Barangay Official');

    const user = await User.create({
      fullName,
      email,
      password,
      role: assignedRole,
      position: position || (assignedRole === 'Admin' ? 'Barangay Captain' : 'Barangay Staff'),
      contactNumber,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        position: user.position,
        contactNumber: user.contactNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login official/admin
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        position: user.position,
        contactNumber: user.contactNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of all officials
// @route   GET /api/auth/officials
// @access  Private
export const getOfficials = async (req, res, next) => {
  try {
    const officials = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: officials.length,
      data: officials,
    });
  } catch (error) {
    next(error);
  }
};
