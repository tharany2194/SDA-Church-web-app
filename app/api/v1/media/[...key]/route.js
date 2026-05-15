import { NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { r2Client } from '@/lib/r2Server';

export async function GET(request, { params }) {
  try {
    const { key } = await params;
    const objectKey = Array.isArray(key) ? key.join('/') : key;

    const command = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: objectKey,
    });

    const response = await r2Client.send(command);
    
    // Transform stream to buffer
    const body = await response.Body.transformToByteArray();

    return new Response(body, {
      headers: {
        'Content-Type': response.ContentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': response.ContentLength?.toString() || '',
      },
    });
  } catch (error) {
    console.error('Media proxy error:', error);
    return new Response('Not Found', { status: 404 });
  }
}
