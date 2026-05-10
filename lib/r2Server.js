import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import crypto from 'crypto';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME;
const PUBLIC_URL = process.env.R2_PUBLIC_URL;

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
