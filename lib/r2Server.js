import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import crypto from 'crypto';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.CLOUDFLARE_R2_BUCKET_NAME;
const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || '';


export async function uploadToR2(buffer, mimetype, originalname, folder = 'images') {
  const ext = path.extname(originalname).toLowerCase();
  const uniqueKey = `${folder}/${crypto.randomUUID()}${ext}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: uniqueKey,
      Body: buffer,
      ContentType: mimetype,
    })
  );

  return { key: uniqueKey, url: `${PUBLIC_URL}/${uniqueKey}` };
}

export async function deleteFromR2(key) {
  if (!key) return;
  await r2Client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
