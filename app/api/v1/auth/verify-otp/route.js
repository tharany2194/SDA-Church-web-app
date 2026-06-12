import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
    try {
        await connectDB();
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ success: false, message: 'Please provide email and OTP' }, { status: 400 });
        }

        const user = await User.findOne({
            email,
            resetPasswordOtp: otp,
            resetPasswordOtpExpire: { $gt: Date.now() }
        }).select('+resetPasswordOtp +resetPasswordOtpExpire');

        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid or expired OTP' }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: 'OTP verified successfully' }, { status: 200 });
    } catch (error) {
        console.error('Verify OTP error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
