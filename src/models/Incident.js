import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema(
  {
    incidentType: {
      type: String,
      required: [true, 'Please specify the type of incident'],
      enum: [
        'Fire',
        'Flood',
        'Vehicular Accident',
        'Medical Emergency',
        'Crime / Violence',
        'Fallen Tree / Powerline',
        'Other',
      ],
      default: 'Other',
    },
    purok: {
      type: String,
      required: [true, 'Please specify the purok or zone'],
      trim: true,
    },
    exactLocation: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Please describe the incident in detail'],
      trim: true,
    },
    reporterName: {
      type: String,
      trim: true,
      default: 'Anonymous Resident',
    },
    reporterContact: {
      type: String,
      trim: true,
      default: '',
    },
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'Verified', 'Responding', 'Resolved', 'Dismissed'],
      default: 'Pending',
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    actionTakenNotes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Incident = mongoose.model('Incident', incidentSchema);
export default Incident;
