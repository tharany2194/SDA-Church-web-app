import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, handleError, ok, created } from '@/lib/apiHelpers';
import Verse from '@/models/Verse';

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
 * Add a new verse (Admin only)
 */
export async function POST(request) {
  const auth = await authenticate(request);
  if (auth.error) return auth.error;

  const roleError = authorize(auth.user, 'admin', 'super_admin', 'editor');
  if (roleError) return roleError;

  try {
    const { contentEn, contentTa, reference } = await request.json();

    await connectDB();

    // Deactivate current active verses
    await Verse.updateMany({ isActive: true }, { isActive: false });

    // Create new verse expiring in 24 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const verse = await Verse.create({
      contentEn,
      contentTa,
      reference,
      isActive: true,
      expiresAt,
    });

    return created(verse);
  } catch (error) {
    return handleError(error);
  }
}
