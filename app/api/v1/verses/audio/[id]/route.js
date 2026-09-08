import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, handleError } from '@/lib/apiHelpers';
import { deleteFromR2 } from '@/lib/r2Server';
import VerseAudio from '@/models/VerseAudio';

export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const authResult = await authenticate(request);
        if (authResult.error) return authResult.error;
        const roleErr = authorize(authResult.user, 'admin', 'editor');
        if (roleErr) return roleErr;

        const resolvedParams = await params;
        const { id } = resolvedParams;

        const audio = await VerseAudio.findById(id);
        if (!audio) {
            return NextResponse.json({ success: false, message: 'Audio track not found' }, { status: 404 });
        }

        if (audio.r2Key) {
            await deleteFromR2(audio.r2Key);
        }

        await audio.deleteOne();

        return NextResponse.json({ success: true, message: 'Audio track deleted successfully' });
    } catch (error) {
        return handleError(error);
    }
}
