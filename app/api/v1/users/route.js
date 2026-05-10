import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, handleError } from '@/lib/apiHelpers';
import User from '@/models/User';

// GET /api/v1/users — list all users (admin+)
export async function GET(request) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;
    const roleErr = authorize(authResult.user, 'admin');
    if (roleErr) return roleErr;

    await connectDB();
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const filter = {};
    if (role) filter.role = role;

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    return NextResponse.json({ success: true, count: users.length, total, data: users });
  } catch (error) {
    return handleError(error);
  }
}
