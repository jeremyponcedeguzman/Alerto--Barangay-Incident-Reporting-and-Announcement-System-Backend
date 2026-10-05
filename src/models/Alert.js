import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an alert title'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please specify the alert type'],
      enum: [
        'Flood',
        'Typhoon',
        'Fire',
        'Earthquake',
        'Medical',
        'Security',
        'Evacuation',
        'General Advisory',
      ],
      default: 'General Advisory',
    },
    severity: {
      type: String,
      required: [true, 'Please specify severity level'],
      enum: ['Low', 'Moderate', 'High', 'Critical'],
      default: 'Moderate',
    },
    description: {
      type: String,
      required: [true, 'Please provide details for the emergency alert'],
      trim: true,
    },
    instructions: {
      type: String,
      trim: true,
      default: '',
    },
    targetPuroks: {
      type: [String],
      default: ['All Puroks'],
    },
    status: {
      type: String,
      enum: ['Active', 'Resolved', 'Archived'],
      default: 'Active',
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    issuerName: {
      type: String,
      default: 'Barangay Disaster Risk Reduction & Management Office',
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Alert = mongoose.model('Alert', alertSchema);
export default Alert;
