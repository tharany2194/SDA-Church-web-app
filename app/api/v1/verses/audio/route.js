import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, parseBody, handleError } from '@/lib/apiHelpers';
import { uploadToR2 } from '@/lib/r2Server';
import VerseAudio from '@/models/VerseAudio';

export async function GET(request) {
    try {
        await connectDB();
        const audioTracks = await VerseAudio.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: audioTracks });
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

        const parsed = await parseBody(request, 'audio');
        if (parsed.error) return parsed.error;
        const { file, fields } = parsed;

        if (!file) {
            return NextResponse.json({ success: false, message: 'No audio file uploaded' }, { status: 400 });
        }

        // Strict 10 MB limit for audio uploads to Cloudflare R2 and DB
        const MAX_AUDIO_BYTES = 10 * 1024 * 1024; // 10 MB
        if (file.buffer.length > MAX_AUDIO_BYTES) {
            return NextResponse.json(
                { success: false, message: 'Audio file size exceeds the maximum limit of 10 MB' },
                { status: 400 }
            );
        }

        const title = fields?.title || file.originalname || 'Background Audio';

        const { url, key } = await uploadToR2(file.buffer, file.mimetype, file.originalname, 'verse-audio');

        const audio = await VerseAudio.create({
            title,
            url,
            r2Key: key,
            createdBy: authResult.user.id,
        });

        return NextResponse.json({ success: true, data: audio }, { status: 201 });
    } catch (error) {
        return handleError(error);
    }
}
