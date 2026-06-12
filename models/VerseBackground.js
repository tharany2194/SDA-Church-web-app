import mongoose from 'mongoose';

const verseBackgroundSchema = new mongoose.Schema(
    {
        url: { type: String, required: true },
        r2Key: { type: String, required: true },
        isActive: { type: Boolean, default: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

export default mongoose.models.VerseBackground || mongoose.model('VerseBackground', verseBackgroundSchema);
