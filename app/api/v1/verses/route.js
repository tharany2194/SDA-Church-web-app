import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, handleError, ok, created } from '@/lib/apiHelpers';
import Verse from '@/models/Verse';
import VerseBackground from '@/models/VerseBackground';
import VerseAudio from '@/models/VerseAudio';

/**
 * GET /api/v1/verses
 * Get verse history
 */
export async function GET() {
  try {
    await connectDB();
    const verses = await Verse.find().sort({ createdAt: -1 });
    return ok(verses);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/v1/verses
 * Add or schedule a verse set (Admin only)
 */
export async function POST(request) {
  const auth = await authenticate(request);
  if (auth.error) return auth.error;

  const roleError = authorize(auth.user, 'admin', 'super_admin', 'editor');
  if (roleError) return roleError;

  try {
    const {
      contentEn,
      contentTa,
      reference,
      referenceTa,
      backgroundUrl: manualBg,
      audioUrl: manualAudio,
      targetDay = 'today' // 'today' or 'tomorrow'
    } = await request.json();

    await connectDB();

    const now = new Date();

    // Resolve background image
    let backgroundUrl = manualBg || null;
    if (!backgroundUrl) {
      const randomBg = await VerseBackground.aggregate([{ $match: { isActive: true } }, { $sample: { size: 1 } }]);
      if (randomBg && randomBg.length > 0) {
        backgroundUrl = randomBg[0].url;
      }
    }

    // Resolve background audio
    let audioUrl = manualAudio || null;
    if (!audioUrl) {
      const randomAudio = await VerseAudio.aggregate([{ $match: { isActive: true } }, { $sample: { size: 1 } }]);
      if (randomAudio && randomAudio.length > 0) {
        audioUrl = randomAudio[0].url;
      }
    }

    let isActive = false;
    let expiresAt;
    let scheduledFor = null;

    if (targetDay === 'tomorrow') {
      // Scheduled for tomorrow 12 AM midnight cycle
      const tomorrowMidnight = new Date(now);
      tomorrowMidnight.setHours(24, 0, 0, 0); // Tonight 12 AM / tomorrow start
      scheduledFor = tomorrowMidnight;

      const dayAfterTomorrow = new Date(tomorrowMidnight);
      dayAfterTomorrow.setHours(24, 0, 0, 0); // Tomorrow night 12 AM
      expiresAt = dayAfterTomorrow;
    } else {
      // Set for TODAY
      await Verse.updateMany({ isActive: true }, { isActive: false });

      isActive = true;
      expiresAt = new Date(now);
      expiresAt.setHours(24, 0, 0, 0); // Expires tonight at 12 AM
    }

    const verse = await Verse.create({
      contentEn,
      contentTa,
      reference,
      referenceTa,
      backgroundUrl,
      audioUrl,
      isActive,
      scheduledFor,
      expiresAt,
    });

    return created(verse);
  } catch (error) {
    return handleError(error);
  }
}
