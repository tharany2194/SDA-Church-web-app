import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, fail, handleError } from '@/lib/apiHelpers';
import User from '@/models/User';

// PATCH /api/v1/users/[id]/status
export async function PATCH(request, { params }) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;
    const roleErr = authorize(authResult.user, 'super_admin');
    if (roleErr) return roleErr;

    const { id } = await params;
    if (id === authResult.user.id) return fail('Cannot deactivate your own account', 400);

    await connectDB();
    const user = await User.findById(id);
    if (!user) return fail('User not found', 404);
    if (user.role === 'super_admin') return fail('Cannot deactivate a Super Admin account', 403);

    user.isActive = !user.isActive;
    await user.save();
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return handleError(error);
  }
}
