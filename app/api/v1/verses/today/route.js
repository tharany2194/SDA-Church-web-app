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
      
      // Select a random verse from history
      const randomVerses = await Verse.aggregate([{ $sample: { size: 1 } }]);
      if (randomVerses.length > 0) {
        return ok(randomVerses[0]);
      }

      return ok(null);
    }

    return ok(verse);
  } catch (error) {
    return handleError(error);
  }
}
