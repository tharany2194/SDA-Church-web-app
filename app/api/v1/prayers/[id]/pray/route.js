import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, fail, handleError } from '@/lib/apiHelpers';
import Prayer from '@/models/Prayer';

// PATCH /api/v1/prayers/[id]/pray — toggle pray
export async function PATCH(request, { params }) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;

    await connectDB();
    const { id } = await params;
    const prayer = await Prayer.findOne({ _id: id, isPrivate: false });
    if (!prayer) return fail('Prayer request not found', 404);

    const alreadyPrayed = prayer.prayedBy.includes(authResult.user.id);
    if (alreadyPrayed) {
      prayer.prayedBy.pull(authResult.user.id);
      prayer.prayerCount = Math.max(0, prayer.prayerCount - 1);
    } else {
      prayer.prayedBy.push(authResult.user.id);
      prayer.prayerCount += 1;
    }
    await prayer.save();

    return NextResponse.json({
      success: true,
      data: prayer,
      praying: !alreadyPrayed,
    });
  } catch (error) {
    return handleError(error);
  }
}
