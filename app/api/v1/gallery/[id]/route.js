import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, parseBody, fail, handleError } from '@/lib/apiHelpers';
import { uploadToR2 } from '@/lib/r2Server';
import Gallery from '@/models/Gallery';

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
    if (file) {
      const folder = file.mimetype.startsWith('video/') ? 'videos' : 'images';
      const { url, key } = await uploadToR2(file.buffer, file.mimetype, file.originalname, folder);
      body.url = url;
      body.r2Key = key;
    }

    await connectDB();
    const { id } = await params;
    const item = await Gallery.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!item) return fail('Gallery item not found', 404);
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
    const item = await Gallery.findByIdAndDelete(id);
    if (!item) return fail('Gallery item not found', 404);
    return NextResponse.json({ success: true, message: 'Gallery item deleted' });
  } catch (error) {
    return handleError(error);
  }
}
