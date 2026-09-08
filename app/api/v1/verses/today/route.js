import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
import { connectDB } from '@/lib/db';
import { handleError, ok } from '@/lib/apiHelpers';
import Verse from '@/models/Verse';

import VerseBackground from '@/models/VerseBackground';
import VerseAudio from '@/models/VerseAudio';

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

    let finalVerse = null;

    if (!verse) {
      // If the active one expired, mark it as inactive
      await Verse.updateMany(
        { isActive: true, expiresAt: { $lte: now } },
        { isActive: false }
      );

      const nextMidnight = new Date(now);
      nextMidnight.setHours(24, 0, 0, 0); // Sets to 12:00:00 AM of the next day

      // Check if an admin manually scheduled a verse for today
      const scheduledVerse = await Verse.findOne({
        scheduledFor: { $lte: now },
        isActive: false,
      }).sort({ scheduledFor: -1 });

      let targetVerse = scheduledVerse;

      // Automatic Fallback: If not manually scheduled, randomly select a verse from history at 12 AM
      if (!targetVerse) {
        const randomVerses = await Verse.aggregate([{ $sample: { size: 1 } }]);
        if (randomVerses.length > 0) {
          targetVerse = randomVerses[0];
        }
      }

      if (targetVerse) {
        let bgUrl = targetVerse.backgroundUrl;
        if (!bgUrl) {
          const randomBg = await VerseBackground.aggregate([{ $match: { isActive: true } }, { $sample: { size: 1 } }]);
          if (randomBg && randomBg.length > 0) {
            bgUrl = randomBg[0].url;
          }
        }

        let audioUrl = targetVerse.audioUrl;
        if (!audioUrl) {
          const randomAudio = await VerseAudio.aggregate([{ $match: { isActive: true } }, { $sample: { size: 1 } }]);
          if (randomAudio && randomAudio.length > 0) {
            audioUrl = randomAudio[0].url;
          }
        }

        const activatedVerse = await Verse.findByIdAndUpdate(
          targetVerse._id,
          {
            isActive: true,
            expiresAt: nextMidnight,
            ...(bgUrl ? { backgroundUrl: bgUrl } : {}),
            ...(audioUrl ? { audioUrl } : {}),
          },
          { new: true }
        );
        finalVerse = activatedVerse.toObject();
      }
    } else {
      finalVerse = verse.toObject();
    }

    if (finalVerse) {
      let needsUpdate = false;
      const updatePayload = {};

      // If active verse doesn't have a background assigned yet, pick one once and persist it
      if (!finalVerse.backgroundUrl) {
        const randomBg = await VerseBackground.aggregate([{ $match: { isActive: true } }, { $sample: { size: 1 } }]);
        if (randomBg && randomBg.length > 0) {
          finalVerse.backgroundUrl = randomBg[0].url;
          updatePayload.backgroundUrl = randomBg[0].url;
          needsUpdate = true;
        }
      }

      // If active verse doesn't have background audio assigned yet, pick one once and persist it
      if (!finalVerse.audioUrl) {
        const randomAudio = await VerseAudio.aggregate([{ $match: { isActive: true } }, { $sample: { size: 1 } }]);
        if (randomAudio && randomAudio.length > 0) {
          finalVerse.audioUrl = randomAudio[0].url;
          updatePayload.audioUrl = randomAudio[0].url;
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        await Verse.findByIdAndUpdate(finalVerse._id, updatePayload);
      }

      return NextResponse.json(
        { success: true, data: finalVerse },
        { status: 200, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }

    return NextResponse.json(
      { success: true, data: null },
      { status: 200, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    );
  } catch (error) {
    return handleError(error);
  }
}
