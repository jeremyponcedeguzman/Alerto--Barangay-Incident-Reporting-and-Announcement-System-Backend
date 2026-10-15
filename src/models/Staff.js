import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      required: [true, 'Please provide staff member name'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Please provide staff role/title'],
      trim: true,
    },
    category: {
      type: String,
      default: 'Official',
      trim: true,
    },
    shift: {
      type: String,
      default: 'Day (8:00 AM - 5:00 PM)',
      trim: true,
    },
    contact: {
      type: String,
      default: '0917-123-4567',
      trim: true,
    },
    isDuty: {
      type: Boolean,
      default: true,
    },
    badge: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

staffSchema.virtual('id').get(function () {
  return this.customId || this._id.toHexString();
});

const Staff = mongoose.model('Staff', staffSchema);
export default Staff;
