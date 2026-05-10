import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, handleError } from '@/lib/apiHelpers';
import Donation from '@/models/Donation';

// POST /api/v1/donations
export async function POST(request) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;

    await connectDB();
    const { amount, currency, method, purpose, notes, referenceNumber } = await request.json();

    const donation = await Donation.create({
      user: authResult.user.id,
      amount,
      currency,
      method,
      purpose,
      notes,
      referenceNumber,
    });

    await donation.populate('user', 'name email');
    return NextResponse.json({ success: true, data: donation }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

// GET /api/v1/donations — admin: all donations
export async function GET(request) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;
    const roleErr = authorize(authResult.user, 'admin');
    if (roleErr) return roleErr;

    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));
    const skip = (page - 1) * limit;

    const filter = {};
    if (searchParams.get('status')) filter.status = searchParams.get('status');
    if (searchParams.get('method')) filter.method = searchParams.get('method');

    const [donations, total] = await Promise.all([
      Donation.find(filter)
        .populate('user', 'name email')
        .populate('confirmedBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Donation.countDocuments(filter),
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
