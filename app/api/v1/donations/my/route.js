import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, handleError } from '@/lib/apiHelpers';
import Donation from '@/models/Donation';

// GET /api/v1/donations/my
export async function GET(request) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;

    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '10'));
    const skip = (page - 1) * limit;

    const [donations, total] = await Promise.all([
      Donation.find({ user: authResult.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Donation.countDocuments({ user: authResult.user.id }),
    ]);

    return NextResponse.json({
      success: true,
      data: donations,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleError(error);
  }
}
