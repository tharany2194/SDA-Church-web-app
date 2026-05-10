import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, fail, handleError } from '@/lib/apiHelpers';
import User from '@/models/User';

const VALID_ROLES = ['super_admin', 'admin', 'editor', 'volunteer', 'member'];

// PATCH /api/v1/users/[id]/role
export async function PATCH(request, { params }) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;
    const roleErr = authorize(authResult.user, 'super_admin');
    if (roleErr) return roleErr;

    const { id } = await params;
    const { role } = await request.json();

    if (!VALID_ROLES.includes(role)) {
      return fail(`Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`, 400);
    }
    if (id === authResult.user.id) return fail('You cannot change your own role', 400);

    await connectDB();
    const target = await User.findById(id);
    if (!target) return fail('User not found', 404);

    if (
      (role === 'super_admin' || role === 'admin' ||
        target.role === 'super_admin' || target.role === 'admin') &&
      authResult.user.role !== 'super_admin'
    ) {
      return fail('Only Super Admin can assign or change admin-level roles', 403);
    }

    target.role = role;
    await target.save();
    return NextResponse.json({ success: true, data: target });
  } catch (error) {
    return handleError(error);
  }
}
