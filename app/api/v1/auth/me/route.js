import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, handleError } from '@/lib/apiHelpers';
import User from '@/models/User';

export async function GET(request) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;

    await connectDB();
    const user = await User.findById(authResult.user.id);

    return NextResponse.json({ success: true, data: { user } }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
