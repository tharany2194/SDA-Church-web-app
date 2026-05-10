import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, parseBody, fail, handleError } from '@/lib/apiHelpers';
import { uploadToR2 } from '@/lib/r2Server';
import Event from '@/models/Event';

// GET /api/v1/events/[id]
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const event = await Event.findOne({ _id: id, isPublished: true }).populate('createdBy', 'name');
    if (!event) return fail('Event not found', 404);
    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    return handleError(error);
  }
}

// PUT /api/v1/events/[id]
export async function PUT(request, { params }) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;
    const roleErr = authorize(authResult.user, 'admin', 'editor', 'volunteer');
    if (roleErr) return roleErr;

    const parsed = await parseBody(request, 'image');
    if (parsed.error) return parsed.error;
    const { fields, file } = parsed;

    const body = { ...fields };
    if (file) {
      const { url } = await uploadToR2(file.buffer, file.mimetype, file.originalname, 'images');
      body.image = url;
    }

    await connectDB();
    const { id } = await params;
    const event = await Event.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!event) return fail('Event not found', 404);
    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/v1/events/[id]
export async function DELETE(request, { params }) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;
    const roleErr = authorize(authResult.user, 'admin');
    if (roleErr) return roleErr;

    await connectDB();
    const { id } = await params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) return fail('Event not found', 404);
    return NextResponse.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    return handleError(error);
  }
}
