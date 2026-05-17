import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, parseBody, fail, handleError } from '@/lib/apiHelpers';
import { uploadToR2, deleteFromR2 } from '@/lib/r2Server';
import Article from '@/models/Article';
import User from '@/models/User';

// GET /api/v1/articles/[id]  — param is slug for GET, _id for PUT/DELETE
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id: slug } = await params;
    const article = await Article.findOneAndUpdate(
      { slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name avatar');
    if (!article) return fail('Article not found', 404);
    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    return handleError(error);
  }
}

// PUT /api/v1/articles/[id]
export async function PUT(request, { params }) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;
    const roleErr = authorize(authResult.user, 'admin', 'editor', 'volunteer');
    if (roleErr) return roleErr;

    const parsed = await parseBody(request, 'coverImage');
    if (parsed.error) return parsed.error;
    const { fields, file } = parsed;

    const body = { ...fields };
    await connectDB();
    const { id } = await params;
    const filter =
      authResult.user.role === 'admin' || authResult.user.role === 'super_admin'
        ? { _id: id }
        : { _id: id, author: authResult.user.id };

    const existing = await Article.findOne(filter);
    if (!existing) return fail('Article not found or unauthorized', 404);

    if (file) {
      const { url, key } = await uploadToR2(file.buffer, file.mimetype, file.originalname, 'images');
      if (existing.coverImageR2Key) await deleteFromR2(existing.coverImageR2Key);
      body.coverImage = url;
      body.coverImageR2Key = key;
    }

    const article = await Article.findOneAndUpdate(filter, body, { new: true, runValidators: true });
    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/v1/articles/[id]
export async function DELETE(request, { params }) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;
    const roleErr = authorize(authResult.user, 'admin');
    if (roleErr) return roleErr;

    await connectDB();
    const { id } = await params;
    const article = await Article.findById(id);
    if (!article) return fail('Article not found', 404);

    if (article.coverImageR2Key) await deleteFromR2(article.coverImageR2Key);

    await article.deleteOne();
    return NextResponse.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    return handleError(error);
  }
}
