import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, parseBody, handleError } from '@/lib/apiHelpers';
import { uploadToR2 } from '@/lib/r2Server';
import Gallery from '@/models/Gallery';

// GET /api/v1/gallery
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const filter = { isPublished: true };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Gallery.find(filter)
        .populate('createdBy', 'name')
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Gallery.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      count: items.length,
      total,
      totalPages: Math.ceil(total / limit),
      data: items,
    });
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/v1/gallery
export async function POST(request) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;
    const roleErr = authorize(authResult.user, 'admin', 'editor', 'volunteer');
    if (roleErr) return roleErr;

    const parsed = await parseBody(request, 'media');
    if (parsed.error) return parsed.error;
    const { fields, file } = parsed;

    const body = { ...fields };
    body.createdBy = authResult.user.id;

    if (file) {
      const folder = file.mimetype.startsWith('video/') ? 'videos' : 'images';
      const { url, key } = await uploadToR2(file.buffer, file.mimetype, file.originalname, folder);
      body.type = file.mimetype.startsWith('video/') ? 'video' : 'image';
      body.url = url;
      body.r2Key = key;
    }

    // YouTube video item
    if (body.youtubeVideoId) {
      body.type = 'video';
      body.thumbnail =
        body.thumbnail ||
        `https://img.youtube.com/vi/${body.youtubeVideoId}/hqdefault.jpg`;
      body.url = body.url || `https://www.youtube.com/watch?v=${body.youtubeVideoId}`;
    }

    await connectDB();
    const item = await Gallery.create(body);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
