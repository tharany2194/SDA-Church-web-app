import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Message title is required'], trim: true, maxlength: [200, 'Title cannot exceed 200 characters'] },
    titleTa: { type: String, trim: true },
    content: { type: String, required: [true, 'Message content is required'] },
    contentTa: { type: String },
    speaker: { type: String, trim: true },
    speakerTa: { type: String, trim: true },
    date: { type: Date, default: Date.now },
    youtubeUrl: { type: String, trim: true },
    youtubeVideoId: { type: String, trim: true },
    videoFile: { type: String, default: null },
    thumbnail: { type: String, default: null },
    duration: { type: String },
    category: { type: String, enum: ['sermon', 'teaching', 'testimony', 'worship', 'other'], default: 'sermon' },
    tags: [{ type: String }],
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    videoFileR2Key: { type: String, default: null },
    thumbnailR2Key: { type: String, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

messageSchema.index({ isPublished: 1, date: -1 });
messageSchema.index({ category: 1 });
messageSchema.index({ tags: 1 });

export default mongoose.models.Message || mongoose.model('Message', messageSchema);
