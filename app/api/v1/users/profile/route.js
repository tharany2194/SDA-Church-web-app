import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, parseBody, handleError } from '@/lib/apiHelpers';
import { uploadToR2 } from '@/lib/r2Server';
import User from '@/models/User';

// GET /api/v1/users/profile
export async function GET(request) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;

    await connectDB();
    const user = await User.findById(authResult.user.id);
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return handleError(error);
  }
}

// PUT /api/v1/users/profile
export async function PUT(request) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;

    const parsed = await parseBody(request, 'avatar');
    if (parsed.error) return parsed.error;
    const { fields, file } = parsed;

    const allowedFields = ['name', 'phone', 'preferredLanguage'];
    const updates = {};
    allowedFields.forEach((f) => {
      if (fields[f] !== undefined) updates[f] = fields[f];
    });

    if (file) {
      const { url } = await uploadToR2(file.buffer, file.mimetype, file.originalname, 'avatars');
      updates.avatar = url;
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(authResult.user.id, updates, {
      new: true,
      runValidators: true,
    });
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return handleError(error);
  }
}
