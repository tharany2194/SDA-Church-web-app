import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
    try {
        await connectDB();
        const { email, otp, newPassword } = await req.json();

        if (!email || !otp || !newPassword) {
            return NextResponse.json({ success: false, message: 'Please provide email, OTP, and new password' }, { status: 400 });
        }

        const user = await User.findOne({
            email,
            resetPasswordOtp: otp,
            resetPasswordOtpExpire: { $gt: Date.now() }
        }).select('+resetPasswordOtp +resetPasswordOtpExpire +password');

        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid or expired OTP' }, { status: 400 });
        }

        // Set new password
        user.password = newPassword;
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpire = undefined;

        await user.save();

        return NextResponse.json({ success: true, message: 'Password reset successfully. You can now login.' }, { status: 200 });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
