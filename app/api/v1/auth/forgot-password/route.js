import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import nodemailer from 'nodemailer';

export async function POST(req) {
    try {
        await connectDB();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, message: 'Please provide an email' }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: 'There is no account with that email' }, { status: 404 });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Set expiry to 10 minutes
        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpire = Date.now() + 10 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        try {
            let transporter;
            let isTestAccount = false;

            // Use real credentials if available
            if (process.env.SMTP_USER) {
                transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST || 'smtp.gmail.com',
                    port: process.env.SMTP_PORT || 465,
                    secure: true,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                });
            } else {
                // For local development without SMTP credentials, dynamically generate an Ethereal test account
                isTestAccount = true;
                const testAccount = await nodemailer.createTestAccount();
                transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false,
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass,
                    },
                });
            }

            const message = {
                from: `${process.env.FROM_NAME || 'SDA Church'} <${process.env.SMTP_USER || 'no-reply@sdachurch.com'}>`,
                to: user.email,
                subject: 'SDA Church - Password Reset OTP',
                html: `
                    <div style="font-family: inherit; max-width: 600px; margin: 0 auto; color: #333; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        <h2 style="color: ##e2b755; text-align: center; margin-bottom: 24px;">Password Reset Request</h2>
                        <p style="font-size: 16px;">Hello,</p>
                        <p style="font-size: 16px;">We received a request to reset your password for your Varadharajapuram SDA Church account. Your One-Time Password (OTP) is:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <div style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #733cf0; background-color: #f3f0ff; padding: 15px 30px; border-radius: 12px; border: 1px solid #ded5fb;">
                                ${otp}
                            </div>
                        </div>
                        <p style="font-size: 14px; color: #666; margin-top: 20px;">This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
                        <p style="font-size: 14px; color: #666;">If you didn't request a password reset, you can safely ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;">
                        <p style="font-size: 12px; color: #999; text-align: center;">&copy; ${new Date().getFullYear()} Varadharajapuram SDA Church. All rights reserved.</p>
                    </div>
                `,
            };

            const info = await transporter.sendMail(message);

            if (isTestAccount) {
                console.log(`\n================================`);
                console.log(`DEVELOPMENT MODE - Test Email Sent`);
                console.log(`OTP generated: ${otp}`);
                console.log(`Preview Email URL: ${nodemailer.getTestMessageUrl(info)}`);
                console.log(`(Configure SMTP_USER in .env to send real emails directly)`);
                console.log(`================================\n`);
            }

            return NextResponse.json({ success: true, message: 'OTP sent to email. Please check your inbox.' }, { status: 200 });
        } catch (err) {
            // If email fails, reset OTP fields
            console.error('Email error:', err);
            user.resetPasswordOtp = undefined;
            user.resetPasswordOtpExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return NextResponse.json({ success: false, message: 'Email could not be sent. Please ensure SMTP credentials are correct.' }, { status: 500 });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
