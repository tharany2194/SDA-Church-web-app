import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { fail, ok } from '@/lib/apiHelpers';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // 1. Validation: All fields are compulsory and must be entered
    if (!name || !email || !subject || !message) {
      return fail('All fields (name, email, subject, message) are compulsory.', 400);
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      return fail('All fields (name, email, subject, message) are compulsory and cannot be empty.', 400);
    }

    // 2. Validation: Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      return fail('Please enter a valid email address.', 400);
    }

    // 3. Configure SMTP Transporter (Google mailer/Nodemailer)
    let transporter;
    if (process.env.SMTP_USER) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Fallback for development if SMTP config is missing (creates ethereal test account)
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

    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'SDA Church website'}" <${process.env.SMTP_USER || 'no-reply@sdachurch.com'}>`,
      to: 'Varadharajapuramsdachurch@gmail.com', // Must reach this ID
      replyTo: trimmedEmail, // Allows admin to reply directly to sender
      subject: `New Contact Message: ${trimmedSubject}`,
      text: `
You have received a new message from the contact form.

Name: ${trimmedName}
Email: ${trimmedEmail}
Subject: ${trimmedSubject}

Message:
${trimmedMessage}
      `,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #733cf0; border-bottom: 2px solid #eaeaea; padding-bottom: 10px;">New Contact Message</h2>
          <p><strong>Name:</strong> ${trimmedName}</p>
          <p><strong>Email:</strong> <a href="mailto:${trimmedEmail}">${trimmedEmail}</a></p>
          <p><strong>Subject:</strong> ${trimmedSubject}</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #733cf0; margin-top: 20px; white-space: pre-wrap;">
            <strong>Message:</strong><br/>
            ${trimmedMessage.replace(/\n/g, '<br/>')}
          </div>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">This message was submitted via the contact form on Varadharajapuram SDA Church website.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    // If using test account, log details for development verification
    if (!process.env.SMTP_USER) {
      console.log(`\n================================`);
      console.log(`DEVELOPMENT MODE - Test Email Sent`);
      console.log(`Preview Email URL: ${nodemailer.getTestMessageUrl(info)}`);
      console.log(`================================\n`);
    }

    return ok({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact email sending error:', error);
    return fail('Failed to send email. Please try again later.', 500);
  }
}
