import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, fail, handleError } from '@/lib/apiHelpers';
import Prayer from '@/models/Prayer';

const ADMIN_ROLES = ['super_admin', 'admin', 'editor', 'volunteer'];

// PUT /api/v1/prayers/[id] — owner can update
export async function PUT(request, { params }) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;

    await connectDB();
    const { id } = await params;
    const prayer = await Prayer.findOne({ _id: id, submittedBy: authResult.user.id });
    if (!prayer) return fail('Prayer request not found or unauthorized', 404);

    const { title, content, isPrivate, status } = await request.json();
    if (title !== undefined) prayer.title = title;
    if (content !== undefined) prayer.content = content;
    if (isPrivate !== undefined) prayer.isPrivate = isPrivate;
    if (status !== undefined) prayer.status = status;

    await prayer.save();
    return NextResponse.json({ success: true, data: prayer });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/v1/prayers/[id] — owner or admin
export async function DELETE(request, { params }) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;

    await connectDB();
    const { id } = await params;
    const isAdmin = ADMIN_ROLES.includes(authResult.user.role);
    const filter = isAdmin
      ? { _id: id }
      : { _id: id, submittedBy: authResult.user.id };

    const prayer = await Prayer.findOneAndDelete(filter);
    if (!prayer) return fail('Prayer request not found or unauthorized', 404);
    return NextResponse.json({ success: true, message: 'Prayer request deleted' });
  } catch (error) {
    return handleError(error);
  }
}
