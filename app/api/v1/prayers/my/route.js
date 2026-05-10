import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, handleError } from '@/lib/apiHelpers';
import Prayer from '@/models/Prayer';

// GET /api/v1/prayers/my
export async function GET(request) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;

    await connectDB();
    const prayers = await Prayer.find({ submittedBy: authResult.user.id })
      .populate('followUps.author', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: prayers.length, data: prayers });
  } catch (error) {
    return handleError(error);
  }
}
