import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, parseBody, handleError } from '@/lib/apiHelpers';
import { uploadToR2 } from '@/lib/r2Server';
import VerseBackground from '@/models/VerseBackground';

export async function GET(request) {
    try {
        await connectDB();
        const backgrounds = await VerseBackground.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: backgrounds });
    } catch (error) {
        return handleError(error);
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const authResult = await authenticate(request);
        if (authResult.error) return authResult.error;
        const roleErr = authorize(authResult.user, 'admin', 'editor', 'volunteer');
        if (roleErr) return roleErr;

        const parsed = await parseBody(request, 'image');
        if (parsed.error) return parsed.error;
        const { file } = parsed;

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
        }

        const { url, key } = await uploadToR2(file.buffer, file.mimetype, file.originalname, 'verse-backgrounds');

        const background = await VerseBackground.create({
            url,
            r2Key: key,
            createdBy: authResult.user.id,
        });

        return NextResponse.json({ success: true, data: background }, { status: 201 });
    } catch (error) {
        return handleError(error);
    }
}
