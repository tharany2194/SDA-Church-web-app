import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

// Helper to check if a value is a placeholder
const isPlaceholder = (val) => {
  if (!val) return true;
  const lower = val.toLowerCase();
  return lower.includes('your_') || lower.includes('pub-xxx') || lower.includes('placeholder');
};

// Dynamically resolve bucket, endpoint, and credentials
const BUCKET = process.env.CLOUDFLARE_R2_BUCKET_NAME || process.env.R2_BUCKET_NAME;
const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || process.env.R2_PUBLIC_URL || '';
const ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY;
const ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT || (process.env.R2_ACCOUNT_ID ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : undefined);

// Check if Cloudflare R2 is fully configured with non-placeholder values
const isR2Configured =
  BUCKET && !isPlaceholder(BUCKET) &&
  ACCESS_KEY_ID && !isPlaceholder(ACCESS_KEY_ID) &&
  SECRET_ACCESS_KEY && !isPlaceholder(SECRET_ACCESS_KEY) &&
  ENDPOINT && !isPlaceholder(ENDPOINT);

// Safely initialize the client (prevents crashes if credentials are completely missing)
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: ENDPOINT || 'https://auto.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: ACCESS_KEY_ID || 'dummy_key',
    secretAccessKey: SECRET_ACCESS_KEY || 'dummy_secret',
  },
});

export async function uploadToR2(buffer, mimetype, originalname, folder = 'images') {
  const ext = path.extname(originalname).toLowerCase();
  const uniqueName = `${crypto.randomUUID()}${ext}`;
  const uniqueKey = `${folder}/${uniqueName}`;

  if (!isR2Configured) {
    console.log('--- File Upload Fallback: Local Disk ---');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, uniqueName);
    fs.writeFileSync(filePath, buffer);
    return { key: `local-${uniqueName}`, url: `/uploads/${uniqueName}` };
  }

  console.log('--- File Upload Target: Cloudflare R2 ---');
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

export async function generatePresignedUrl(originalname, mimetype, folder = 'images') {
  if (!isR2Configured) {
    throw new Error('Cloudflare R2 is not configured. Presigned URLs require R2.');
  }

  const ext = path.extname(originalname).toLowerCase();
  const uniqueName = `${crypto.randomUUID()}${ext}`;
  const uniqueKey = `${folder}/${uniqueName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: uniqueKey,
    ContentType: mimetype,
  });

  const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
  const publicUrl = `${PUBLIC_URL}/${uniqueKey}`;

  return { presignedUrl, key: uniqueKey, publicUrl };
}

export async function deleteFromR2(key) {
  if (!key) return;

  try {
    if (key.startsWith('local-')) {
      const fileName = key.replace('local-', '');
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Deleted local fallback file:', fileName);
      }
      return;
    }

    if (isR2Configured) {
      await r2Client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
      console.log('Deleted file from R2:', key);
    }
  } catch (err) {
    console.error(`Warning: Failed to delete file key ${key} from storage:`, err.message);
    // Explicitly swallow storage deletion errors to keep DB records deletable
  }
}
