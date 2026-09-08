import mongoose from 'mongoose';

const verseSchema = new mongoose.Schema(
  {
    contentEn: {
      type: String,
      required: [true, 'English content is required'],
      trim: true,
    },
    contentTa: {
      type: String,
      required: [true, 'Tamil content is required'],
      trim: true,
    },
    reference: {
      type: String,
      required: [true, 'English reference is required'],
      trim: true,
    },
    referenceTa: {
      type: String,
      required: [true, 'Tamil reference is required'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    backgroundUrl: {
      type: String,
      default: null,
    },
    audioUrl: {
      type: String,
      default: null,
    },
    scheduledFor: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index to quickly find the active verse
verseSchema.index({ isActive: 1, expiresAt: 1 });

// Clear model from cache in development to reflect schema changes
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Verse;
}

const Verse = mongoose.models.Verse || mongoose.model('Verse', verseSchema);
export default Verse;
