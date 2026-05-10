import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, parseBody, fail, handleError } from '@/lib/apiHelpers';
import { uploadToR2 } from '@/lib/r2Server';
import Article from '@/models/Article';

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
    if (file) {
      const { url } = await uploadToR2(file.buffer, file.mimetype, file.originalname, 'images');
      body.coverImage = url;
    }

    await connectDB();
    const { id } = await params;
    const filter =
      authResult.user.role === 'admin' || authResult.user.role === 'super_admin'
        ? { _id: id }
        : { _id: id, author: authResult.user.id };

    const article = await Article.findOneAndUpdate(filter, body, { new: true, runValidators: true });
    if (!article) return fail('Article not found or unauthorized', 404);
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
    const article = await Article.findByIdAndDelete(id);
    if (!article) return fail('Article not found', 404);
    return NextResponse.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    return handleError(error);
  }
}
