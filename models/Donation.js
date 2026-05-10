import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: [true, 'Amount is required'], min: [1, 'Amount must be at least 1'] },
    currency: { type: String, default: 'INR', enum: ['INR', 'USD', 'GBP'] },
    method: { type: String, required: [true, 'Payment method is required'], enum: ['bank_transfer', 'cash', 'upi', 'cheque', 'online'] },
    purpose: { type: String, enum: ['general', 'building', 'mission', 'charity', 'youth', 'other'], default: 'general' },
    notes: { type: String, maxlength: [500, 'Notes cannot exceed 500 characters'], trim: true },
    referenceNumber: { type: String, trim: true, maxlength: 100 },
    status: { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
    confirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    confirmedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Donation || mongoose.model('Donation', donationSchema);
