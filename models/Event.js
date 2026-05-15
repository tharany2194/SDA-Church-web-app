import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Event title is required'], trim: true, maxlength: [200, 'Title cannot exceed 200 characters'] },
    titleTa: { type: String, trim: true },
    description: { type: String, required: [true, 'Event description is required'] },
    descriptionTa: { type: String },
    startDate: { type: Date, required: [true, 'Start date is required'] },
    endDate: { type: Date },
    location: { type: String, trim: true },
    category: { type: String, enum: ['service', 'prayer', 'youth', 'outreach', 'special', 'other'], default: 'other' },
    image: { type: String, default: null },
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    imageR2Key: { type: String, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

eventSchema.index({ startDate: 1 });
eventSchema.index({ isPublished: 1 });

export default mongoose.models.Event || mongoose.model('Event', eventSchema);
