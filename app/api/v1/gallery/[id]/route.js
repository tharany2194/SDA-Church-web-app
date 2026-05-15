import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, parseBody, fail, handleError } from '@/lib/apiHelpers';
import { uploadToR2, deleteFromR2 } from '@/lib/r2Server';
import Gallery from '@/models/Gallery';
import { getYouTubeId } from '@/lib/youtube';

// PUT /api/v1/gallery/[id]
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
    const existing = await Gallery.findById(id);
    if (!existing) return fail('Gallery item not found', 404);

    if (file) {
      const folder = file.mimetype.startsWith('video/') ? 'videos' : 'images';
      const { url, key } = await uploadToR2(file.buffer, file.mimetype, file.originalname, folder);
      if (existing.r2Key) await deleteFromR2(existing.r2Key);
      body.url = url;
      body.r2Key = key;
    }

    if (body.youtubeVideoId) {
      const vid = getYouTubeId(body.youtubeVideoId);
      if (vid) {
        body.youtubeVideoId = vid;
        // Also update thumbnail if it was a youtube-generated one
        if (!file && (!body.thumbnail || body.thumbnail.includes('youtube.com'))) {
          body.thumbnail = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
          body.url = `https://www.youtube.com/watch?v=${vid}`;
        }
      }
    }

    const item = await Gallery.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/v1/gallery/[id]
export async function DELETE(request, { params }) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;
    const roleErr = authorize(authResult.user, 'admin');
    if (roleErr) return roleErr;

    await connectDB();
    const { id } = await params;
    const item = await Gallery.findById(id);
    if (!item) return fail('Gallery item not found', 404);

    if (item.r2Key) await deleteFromR2(item.r2Key);

    await item.deleteOne();
    return NextResponse.json({ success: true, message: 'Gallery item deleted' });
  } catch (error) {
    return handleError(error);
  }
}
