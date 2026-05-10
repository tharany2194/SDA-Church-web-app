import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, handleError } from '@/lib/apiHelpers';
import RefreshToken from '@/models/RefreshToken';

export async function POST(request) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;

    await connectDB();

    const token = request.cookies.get('refreshToken')?.value;
    if (token) {
      await RefreshToken.findOneAndUpdate({ token }, { isRevoked: true });
    }

    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });
    return response;
  } catch (error) {
    return handleError(error);
  }
}
