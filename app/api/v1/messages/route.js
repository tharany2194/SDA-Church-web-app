import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, parseBody, handleError } from '@/lib/apiHelpers';
import { uploadToR2 } from '@/lib/r2Server';
import Message from '@/models/Message';
import { getYouTubeId } from '@/lib/youtube';

// GET /api/v1/messages
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;

    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
      Message.find(filter)
        .populate('createdBy', 'name')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      Message.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      count: messages.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: messages,
    });
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/v1/messages
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
      if (file.mimetype.startsWith('video/')) {
        body.videoFile = url;
        body.videoFileR2Key = key;
      } else {
        body.thumbnail = url;
        body.thumbnailR2Key = key;
      }
    }

    if (body.youtubeUrl) {
      const vid = getYouTubeId(body.youtubeUrl);
      if (vid) {
        body.youtubeVideoId = vid;
        // Optionally update youtubeUrl to standard format
        body.youtubeUrl = `https://www.youtube.com/watch?v=${vid}`;
      }
    }


    await connectDB();
    const message = await Message.create(body);
    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
