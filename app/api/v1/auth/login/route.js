import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { generateAccessToken, generateRefreshToken } from '@/lib/tokenUtils';
import { fail, handleError } from '@/lib/apiHelpers';
import { createLimiter } from '@/lib/rateLimit';
import User from '@/models/User';
import RefreshToken from '@/models/RefreshToken';
import logger from '@/lib/logger';

const REFRESH_TOKEN_EXPIRE_DAYS = parseInt(process.env.JWT_REFRESH_EXPIRE) || 7;
const authLimiter = createLimiter({ windowMs: 15 * 60 * 1000, max: 10 });

function setRefreshCookie(response, token) {
  response.cookies.set('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
    path: '/',
  });
}

export async function POST(request) {
  const limited = authLimiter(request);
  if (limited) return limited;

  try {
    await connectDB();
    const { email, password } = await request.json();

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return fail('Invalid email or password', 401);
    }
    if (!user.isActive) return fail('Account has been deactivated', 403);

    const payload = { id: user._id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRE_DAYS);

    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt,
      userAgent: request.headers.get('user-agent'),
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1',
    });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    logger.info(`User logged in: ${email}`);

    // Omit password from response
    const userObj = user.toJSON();

    const response = NextResponse.json(
      { success: true, message: 'Login successful', data: { user: userObj, accessToken } },
      { status: 200 }
    );
    setRefreshCookie(response, refreshToken);
    return response;
  } catch (error) {
    return handleError(error);
  }
}
