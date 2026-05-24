import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/db';
import { handleError, ok } from '@/lib/apiHelpers';
import Verse from '@/models/Verse';

/**
 * GET /api/v1/verses/today
 * Get the current active and non-expired verse
 */
export async function GET() {
  try {
    await connectDB();
    const now = new Date();

    // Find the active verse
    const verse = await Verse.findOne({
      isActive: true,
      expiresAt: { $gt: now },
    });

    if (!verse) {
      // If the active one expired, mark it as inactive
      await Verse.updateMany(
        { isActive: true, expiresAt: { $lte: now } },
        { isActive: false }
      );

      // Select a random verse from history and make it the active verse for 24 hours
      const randomVerses = await Verse.aggregate([{ $sample: { size: 1 } }]);
      if (randomVerses.length > 0) {
        const newExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

        const activatedVerse = await Verse.findByIdAndUpdate(
          randomVerses[0]._id,
          { isActive: true, expiresAt: newExpiry },
          { new: true }
        );
        return ok(activatedVerse);
      }

      return ok(null);
    }

    return ok(verse);
  } catch (error) {
    return handleError(error);
  }
}
