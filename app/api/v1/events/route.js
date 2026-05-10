import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, parseBody, handleError } from '@/lib/apiHelpers';
import { uploadToR2 } from '@/lib/r2Server';
import Event from '@/models/Event';

// GET /api/v1/events
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const category = searchParams.get('category');

    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      filter.startDate = { $gte: start, $lte: end };
    }

    const events = await Event.find(filter).populate('createdBy', 'name').sort({ startDate: 1 });
    return NextResponse.json({ success: true, count: events.length, data: events });
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/v1/events
export async function POST(request) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;
    const roleErr = authorize(authResult.user, 'admin', 'editor', 'volunteer');
    if (roleErr) return roleErr;

    const parsed = await parseBody(request, 'image');
    if (parsed.error) return parsed.error;
    const { fields, file } = parsed;

    const body = { ...fields };
    body.createdBy = authResult.user.id;

    if (file) {
      const { url } = await uploadToR2(file.buffer, file.mimetype, file.originalname, 'images');
      body.image = url;
    }

    await connectDB();
    const event = await Event.create(body);
    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
