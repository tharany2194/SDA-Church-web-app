import { request } from 'http';
import { NextResponse } from 'next/server';
import { authenticate, authorize, handleError } from '@/lib/apiHelpers';
import { generatePresignedUrl } from '@/lib/r2Server';

export async function POST(request) {
    try {
        const authResult = await authenticate(request);
        if (authResult.error) return authResult.error;
        const roleErr = authorize(authResult.user, 'admin', 'editor', 'volunteer');
        if (roleErr) return roleErr;

        const body = await request.json();
        const { filename, contentType, folder } = body;

        if (!filename || !contentType) {
            return NextResponse.json({ success: false, message: 'filename and contentType are required' }, { status: 400 });
        }

        const result = await generatePresignedUrl(filename, contentType, folder || 'images');

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return handleError(error);
    }
}
