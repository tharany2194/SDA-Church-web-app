import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Article title is required'], trim: true, maxlength: [300, 'Title cannot exceed 300 characters'] },
    titleTa: { type: String, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    content: { type: String, required: [true, 'Article content is required'] },
    contentTa: { type: String },
    excerpt: { type: String, maxlength: [500, 'Excerpt cannot exceed 500 characters'] },
    coverImage: { type: String, default: null },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, enum: ['devotional', 'news', 'testimony', 'announcement', 'other'], default: 'other' },
    tags: [{ type: String }],
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    coverImageR2Key: { type: String, default: null },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

articleSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

articleSchema.index({ isPublished: 1, publishedAt: -1 });
articleSchema.index({ category: 1 });

export default mongoose.models.Article || mongoose.model('Article', articleSchema);
