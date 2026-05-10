import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, fail, handleError } from '@/lib/apiHelpers';
import Donation from '@/models/Donation';

// PATCH /api/v1/donations/[id]/status
export async function PATCH(request, { params }) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;
    const roleErr = authorize(authResult.user, 'admin');
    if (roleErr) return roleErr;

    const { status } = await request.json();
    if (!['confirmed', 'rejected'].includes(status)) {
      return fail('Invalid status', 400);
    }

    await connectDB();
    const { id } = await params;
    const donation = await Donation.findByIdAndUpdate(
      id,
      { status, confirmedBy: authResult.user.id, confirmedAt: new Date() },
      { new: true }
    ).populate('user', 'name email');

    if (!donation) return fail('Donation not found', 404);
    return NextResponse.json({ success: true, data: donation });
  } catch (error) {
    return handleError(error);
  }
}
