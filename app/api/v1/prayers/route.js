import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, handleError } from '@/lib/apiHelpers';
import Prayer from '@/models/Prayer';

const ADMIN_ROLES = ['super_admin', 'admin', 'editor', 'volunteer'];

// GET /api/v1/prayers
export async function GET(request) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;

    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const isAdmin = ADMIN_ROLES.includes(authResult.user.role);

    const filter = isAdmin ? {} : { isPrivate: false };
    if (status) filter.status = status;

    const prayers = await Prayer.find(filter)
      .populate('submittedBy', 'name avatar')
      .populate('followUps.author', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: prayers.length, data: prayers });
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/v1/prayers
export async function POST(request) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;

    await connectDB();
    const body = await request.json();
    body.submittedBy = authResult.user.id;

    const prayer = await Prayer.create(body);
    return NextResponse.json({ success: true, data: prayer }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
