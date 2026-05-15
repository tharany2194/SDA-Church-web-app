import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, parseBody, handleError } from '@/lib/apiHelpers';
import { uploadToR2 } from '@/lib/r2Server';
import Article from '@/models/Article';

// GET /api/v1/articles
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const featured = searchParams.get('featured');

    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;

    const skip = (page - 1) * limit;
    const [articles, total] = await Promise.all([
      Article.find(filter)
        .populate('author', 'name avatar')
        .select('-content -contentTa')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit),
      Article.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      count: articles.length,
      total,
      totalPages: Math.ceil(total / limit),
      data: articles,
    });
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/v1/articles
export async function POST(request) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;
    const roleErr = authorize(authResult.user, 'admin', 'editor', 'volunteer');
    if (roleErr) return roleErr;

    const parsed = await parseBody(request, 'coverImage');
    if (parsed.error) return parsed.error;
    const { fields, file } = parsed;

    const body = { ...fields };
    body.author = authResult.user.id;

    if (file) {
      const { url, key } = await uploadToR2(file.buffer, file.mimetype, file.originalname, 'images');
      body.coverImage = url;
      body.coverImageR2Key = key;
    }

    await connectDB();
    const article = await Article.create(body);
    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
