import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import RefreshToken from '@/models/RefreshToken';
import User from '@/models/User';
import { verifyRefreshToken } from '@/lib/tokenUtils';

export async function GET() {
    await connectDB();
    const tokenRecord = await RefreshToken.findOne().sort({ createdAt: -1 });
    if (!tokenRecord) return NextResponse.json({ error: 'No tokens found' });

    let decoded, verifyError;
    try {
        decoded = verifyRefreshToken(tokenRecord.token);
    } catch (err) {
        verifyError = err.message;
    }

    const user = await User.findById(decoded?.id || tokenRecord.user);

    return NextResponse.json({
        tokenRecord,
        decoded,
        verifyError,
        userFound: !!user,
        userIsActive: user?.isActive
    });
}
