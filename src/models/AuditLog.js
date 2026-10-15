import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'System',
      trim: true,
    },
    action: {
      type: String,
      required: [true, 'Please provide audit action'],
      trim: true,
    },
    actor: {
      type: String,
      default: 'System',
      trim: true,
    },
    target: {
      type: String,
      default: 'N/A',
      trim: true,
    },
    details: {
      type: String,
      default: '',
      trim: true,
    },
    severity: {
      type: String,
      default: 'info',
      enum: ['info', 'notice', 'warning', 'critical'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

auditLogSchema.virtual('id').get(function () {
  return this.customId || this._id.toHexString();
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
