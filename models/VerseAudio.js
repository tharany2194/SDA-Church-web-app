import mongoose from 'mongoose';

const verseAudioSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    url: { type: String, required: true },
    r2Key: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.VerseAudio || mongoose.model('VerseAudio', verseAudioSchema);
