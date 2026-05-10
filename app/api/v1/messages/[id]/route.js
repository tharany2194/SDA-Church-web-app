import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, parseBody, fail, handleError } from '@/lib/apiHelpers';
import { uploadToR2 } from '@/lib/r2Server';
import Message from '@/models/Message';

const YOUTUBE_REGEX =
  /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;

// GET /api/v1/messages/[id]
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const message = await Message.findOneAndUpdate(
      { _id: id, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('createdBy', 'name');
    if (!message) return fail('Message not found', 404);
    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    return handleError(error);
  }
}

// PUT /api/v1/messages/[id]
export async function PUT(request, { params }) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;
    const roleErr = authorize(authResult.user, 'admin', 'editor', 'volunteer');
    if (roleErr) return roleErr;

    const parsed = await parseBody(request, 'media');
    if (parsed.error) return parsed.error;
    const { fields, file } = parsed;

    const body = { ...fields };
    if (file) {
      const folder = file.mimetype.startsWith('video/') ? 'videos' : 'images';
      const { url } = await uploadToR2(file.buffer, file.mimetype, file.originalname, folder);
      if (file.mimetype.startsWith('video/')) body.videoFile = url;
      else body.thumbnail = url;
    }
    if (body.youtubeUrl) {
      const match = body.youtubeUrl.match(YOUTUBE_REGEX);
      if (match) body.youtubeVideoId = match[1];
    }

    await connectDB();
    const { id } = await params;
    const message = await Message.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!message) return fail('Message not found', 404);
    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/v1/messages/[id]
export async function DELETE(request, { params }) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;
    const roleErr = authorize(authResult.user, 'admin');
    if (roleErr) return roleErr;

    await connectDB();
    const { id } = await params;
    const message = await Message.findByIdAndDelete(id);
    if (!message) return fail('Message not found', 404);
    return NextResponse.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    return handleError(error);
  }
}
