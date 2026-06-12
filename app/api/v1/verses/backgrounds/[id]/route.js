import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, handleError } from '@/lib/apiHelpers';
import { deleteFromR2 } from '@/lib/r2Server';
import VerseBackground from '@/models/VerseBackground';

export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const authResult = await authenticate(request);
        if (authResult.error) return authResult.error;
        const roleErr = authorize(authResult.user, 'admin', 'editor');
        if (roleErr) return roleErr;

        // Must wait for params
        const resolvedParams = await params;
        const { id } = resolvedParams;

        const background = await VerseBackground.findById(id);
        if (!background) {
            return NextResponse.json({ success: false, message: 'Background not found' }, { status: 404 });
        }

        // Delete from R2
        if (background.r2Key) {
            await deleteFromR2(background.r2Key);
        }

        // Delete from DB
        await background.deleteOne();

        return NextResponse.json({ success: true, message: 'Background deleted successfully' });
    } catch (error) {
        return handleError(error);
    }
}
