import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, parseBody, fail, handleError } from '@/lib/apiHelpers';
import { uploadToR2, deleteFromR2 } from '@/lib/r2Server';
import Message from '@/models/Message';
import { getYouTubeId } from '@/lib/youtube';

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

    await connectDB();
    const { id } = await params;
    const existing = await Message.findById(id);
    if (!existing) return fail('Message not found', 404);

    if (file) {
      const folder = file.mimetype.startsWith('video/') ? 'videos' : 'images';
      const { url, key } = await uploadToR2(file.buffer, file.mimetype, file.originalname, folder);
      if (file.mimetype.startsWith('video/')) {
        if (existing.videoFileR2Key) await deleteFromR2(existing.videoFileR2Key);
        body.videoFile = url;
        body.videoFileR2Key = key;
      } else {
        if (existing.thumbnailR2Key) await deleteFromR2(existing.thumbnailR2Key);
        body.thumbnail = url;
        body.thumbnailR2Key = key;
      }
    } else {
      if (body.videoFileR2Key && body.videoFileR2Key !== existing.videoFileR2Key) {
        if (existing.videoFileR2Key) await deleteFromR2(existing.videoFileR2Key);
      }
      if (body.thumbnailR2Key && body.thumbnailR2Key !== existing.thumbnailR2Key) {
        if (existing.thumbnailR2Key) await deleteFromR2(existing.thumbnailR2Key);
      }
    }

    if (body.youtubeUrl) {
      const vid = getYouTubeId(body.youtubeUrl);
      if (vid) body.youtubeVideoId = vid;
    }

    const message = await Message.findByIdAndUpdate(id, body, { new: true, runValidators: true });
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
    const message = await Message.findById(id);
    if (!message) return fail('Message not found', 404);

    if (message.videoFileR2Key) await deleteFromR2(message.videoFileR2Key);
    if (message.thumbnailR2Key) await deleteFromR2(message.thumbnailR2Key);

    await message.deleteOne();
    return NextResponse.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    return handleError(error);
  }
}
