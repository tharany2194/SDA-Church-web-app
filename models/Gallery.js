import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: [200, 'Title cannot exceed 200 characters'] },
    titleTa: { type: String, trim: true },
    description: { type: String },
    descriptionTa: { type: String },
    type: { type: String, enum: ['image', 'video'], required: true },
    url: { type: String, required: [true, 'Media URL is required'] },
    thumbnail: { type: String },
    youtubeVideoId: { type: String },
    category: { type: String, enum: ['service', 'event', 'youth', 'outreach', 'general'], default: 'general' },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

gallerySchema.index({ type: 1, isPublished: 1 });
gallerySchema.index({ category: 1 });

export default mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);
