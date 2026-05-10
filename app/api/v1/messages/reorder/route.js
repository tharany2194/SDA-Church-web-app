import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, fail, handleError } from '@/lib/apiHelpers';
import Message from '@/models/Message';

// PATCH /api/v1/messages/reorder
export async function PATCH(request) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;
    const roleErr = authorize(authResult.user, 'admin', 'editor', 'volunteer');
    if (roleErr) return roleErr;

    const { orderedIds } = await request.json();
    if (!Array.isArray(orderedIds)) {
      return fail('orderedIds must be an array', 400);
    }

    await connectDB();
    const bulkOps = orderedIds.map(({ id, order }) => ({
      updateOne: { filter: { _id: id }, update: { order } },
    }));
    await Message.bulkWrite(bulkOps);
    return NextResponse.json({ success: true, message: 'Messages reordered' });
  } catch (error) {
    return handleError(error);
  }
}
