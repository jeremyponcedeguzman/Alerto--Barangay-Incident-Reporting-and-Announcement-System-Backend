import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      sparse: true,
    },
    title: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      default: 'flood',
    },
    incidentType: {
      type: String,
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
    severity: {
      type: String,
      default: 'medium',
    },
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    purok: {
      type: String,
      trim: true,
      default: '',
    },
    locationName: {
      type: String,
      trim: true,
      default: '',
    },
    exactLocation: {
      type: String,
      trim: true,
      default: '',
    },
    lat: {
      type: Number,
      default: 14.5605,
    },
    lng: {
      type: Number,
      default: 121.0182,
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
    reportedBy: {
      type: String,
      trim: true,
      default: 'Anonymous Resident',
    },
    reporterContact: {
      type: String,
      trim: true,
      default: '',
    },
    imageEvidence: {
      type: String, // Cloudinary secure URL or fallback base64
      default: '',
    },
    cloudinaryPublicId: {
      type: String,
      default: '',
    },
    responder: {
      type: String,
      trim: true,
      default: 'Barangay Operations Desk',
    },
    votes: {
      type: Number,
      default: 1,
    },
    isUserReport: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

incidentSchema.virtual('id').get(function () {
  return this.customId || this._id.toHexString();
});

incidentSchema.pre('save', function () {
  // Sync title if missing
  if (!this.title) {
    this.title = `${this.category || this.incidentType || 'Incident'} Report at ${
      this.locationName || this.exactLocation || this.purok || 'Barangay'
    }`;
  }
  // Sync location fields
  if (!this.locationName && (this.exactLocation || this.purok)) {
    this.locationName = this.exactLocation || this.purok;
  } else if (!this.purok && this.locationName) {
    this.purok = this.locationName;
  }
  // Sync reporter names
  if (!this.reportedBy && this.reporterName) {
    this.reportedBy = this.reporterName;
  } else if (!this.reporterName && this.reportedBy) {
    this.reporterName = this.reportedBy;
  }
});

const Incident = mongoose.model('Incident', incidentSchema);
export default Incident;
