import mongoose from 'mongoose';

const residentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide resident full name'],
      trim: true,
    },
    contactNumber: {
      type: String,
      required: [true, 'Please provide contact number for emergency SMS'],
      trim: true,
    },
    purok: {
      type: String,
      required: [true, 'Please specify Purok or Zone'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    householdHead: {
      type: Boolean,
      default: false,
    },
    isSeniorCitizen: {
      type: Boolean,
      default: false,
    },
    isPWD: {
      type: Boolean,
      default: false, // Priority during emergency evacuations
    },
    emergencyContactPerson: {
      type: String,
      trim: true,
      default: '',
    },
    emergencyContactNumber: {
      type: String,
      trim: true,
      default: '',
    },
    verificationStatus: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'approved',
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    role: {
      type: String,
      default: 'resident',
    },
    proofOfResidencyName: {
      type: String,
      default: '',
    },
    proofOfResidencyUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Resident = mongoose.model('Resident', residentSchema);
export default Resident;
