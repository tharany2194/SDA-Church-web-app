import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, fail, handleError } from '@/lib/apiHelpers';
import User from '@/models/User';

// PUT /api/v1/users/change-password
export async function PUT(request) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;

    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword) {
      return fail('Current and new passwords are required', 400);
    }

    await connectDB();
    const user = await User.findById(authResult.user.id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return fail('Current password is incorrect', 401);
    }

    user.password = newPassword;
    await user.save();

    return NextResponse.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    return handleError(error);
  }
}
