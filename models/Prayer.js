import mongoose from 'mongoose';

const prayerSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Prayer request title is required'], trim: true, maxlength: [200, 'Title cannot exceed 200 characters'] },
    content: { type: String, required: [true, 'Prayer request content is required'], maxlength: [2000, 'Content cannot exceed 2000 characters'] },
    isPrivate: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'answered', 'active'], default: 'active' },
    prayerCount: { type: Number, default: 0 },
    prayedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    followUps: [
      {
        message: { type: String, required: true, trim: true, maxlength: [1000, 'Follow-up cannot exceed 1000 characters'] },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

prayerSchema.index({ submittedBy: 1 });
prayerSchema.index({ isPrivate: 1 });

export default mongoose.models.Prayer || mongoose.model('Prayer', prayerSchema);
