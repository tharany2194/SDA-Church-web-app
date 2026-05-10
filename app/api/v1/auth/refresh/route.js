import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyRefreshToken, generateAccessToken } from '@/lib/tokenUtils';
import { fail, handleError } from '@/lib/apiHelpers';
import RefreshToken from '@/models/RefreshToken';
import User from '@/models/User';

export async function POST(request) {
  try {
    const token = request.cookies.get('refreshToken')?.value;
    if (!token) return fail('No refresh token provided', 401);

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      return fail('Invalid or expired refresh token', 401);
    }

    await connectDB();

    const storedToken = await RefreshToken.findOne({ token, isRevoked: false });
    if (!storedToken) return fail('Refresh token revoked or not found', 401);

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) return fail('User not found or inactive', 401);

    const payload = { id: user._id, role: user.role };
    const newAccessToken = generateAccessToken(payload);

    return NextResponse.json(
      { success: true, data: { accessToken: newAccessToken } },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
