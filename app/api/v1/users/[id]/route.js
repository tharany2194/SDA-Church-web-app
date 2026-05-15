import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, fail, handleError } from '@/lib/apiHelpers';
import { deleteFromR2 } from '@/lib/r2Server';
import User from '@/models/User';

// DELETE /api/v1/users/[id]
export async function DELETE(request, { params }) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;
    const roleErr = authorize(authResult.user, 'super_admin');
    if (roleErr) return roleErr;

    const { id } = await params;
    if (id === authResult.user.id) return fail('Cannot delete your own account', 400);

    await connectDB();
    const user = await User.findById(id);
    if (!user) return fail('User not found', 404);
    if (user.role === 'super_admin') return fail('Cannot delete a Super Admin account', 403);

    if (user.avatarR2Key) await deleteFromR2(user.avatarR2Key);
    await user.deleteOne();
    return NextResponse.json({ success: true, message: 'User deleted' });
  } catch (error) {
    return handleError(error);
  }
}
