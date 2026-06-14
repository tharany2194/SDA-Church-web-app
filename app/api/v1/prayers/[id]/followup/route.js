import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, fail, handleError } from '@/lib/apiHelpers';
import Prayer from '@/models/Prayer';

// POST /api/v1/prayers/[id]/followup — owner adds follow-up
export async function POST(request, { params }) {
  try {
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;

    const { message } = await request.json();
    if (!message?.trim()) return fail('Message is required', 400);

    await connectDB();
    const { id } = await params;
    const prayer = await Prayer.findById(id);

    const isAdmin = ['super_admin', 'admin', 'editor', 'volunteer'].includes(authResult.user.role);
    if (!prayer || (prayer.submittedBy.toString() !== authResult.user.id && !isAdmin)) {
      return fail('Prayer request not found or unauthorized', 404);
    }

    prayer.followUps.push({ message: message.trim(), author: authResult.user.id });
    await prayer.save();
    await prayer.populate('followUps.author', 'name');

    const newEntry = prayer.followUps[prayer.followUps.length - 1];
    return NextResponse.json({ success: true, data: newEntry }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
