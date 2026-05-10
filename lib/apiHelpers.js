import { NextResponse } from 'next/server';
import { connectDB } from './db';
import { verifyAccessToken } from './tokenUtils';
import logger from './logger';

// ─── Standard JSON responses ─────────────────────────────────────────────────

export const ok = (data, status = 200) =>
  NextResponse.json({ success: true, data }, { status });

export const created = (data) =>
  NextResponse.json({ success: true, data }, { status: 201 });

export const msg = (message, status = 200) =>
  NextResponse.json({ success: true, message }, { status });

export const fail = (message, status = 400) =>
  NextResponse.json({ success: false, message }, { status });

// ─── Authentication helper ────────────────────────────────────────────────────

/**
 * Verifies the Bearer access token from the Authorization header.
 * Returns { user: { id, role } } on success, or { error: NextResponse } on failure.
 */
export async function authenticate(request) {
  const authHeader = request.headers.get('authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return { error: fail('Authentication required', 401) };
  }

  const token = authHeader.slice(7);
  try {
    const decoded = verifyAccessToken(token);
    await connectDB();

    // Lazy import to avoid circular deps at module load time
    const { default: User } = await import('../models/User.js');
    const user = await User.findById(decoded.id).select('role isActive').lean();

    if (!user) return { error: fail('User not found', 401) };
    if (!user.isActive) return { error: fail('Account has been deactivated', 403) };

    return { user: { id: String(user._id), role: user.role } };
  } catch (err) {
    logger.warn(`Invalid access token: ${err.message}`);
    return { error: fail('Invalid or expired token', 401) };
  }
}

// ─── Authorization helper ─────────────────────────────────────────────────────

/**
 * Returns a 403 NextResponse if the user lacks the required role,
 * or null if access is granted. super_admin always passes.
 */
export function authorize(user, ...roles) {
  if (user.role === 'super_admin') return null;
  if (!roles.includes(user.role)) {
    return fail(`Access denied. Required role: ${roles.join(' or ')}`, 403);
  }
  return null;
}

// ─── File upload helper ───────────────────────────────────────────────────────

const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'video/mp4', 'video/webm', 'video/quicktime',
];

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024;

/**
 * Parses a multipart/form-data request. Returns:
 *   { fields, file } where file is { buffer, mimetype, originalname } or null.
 * Returns { fields, file: null } for JSON requests.
 */
export async function parseBody(request, fileField = 'file') {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const fields = {};
    let file = null;

    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        // Support dot-notation or repeated keys as arrays
        if (fields[key] !== undefined) {
          fields[key] = [].concat(fields[key], value);
        } else {
          fields[key] = value;
        }
      } else if (key === fileField && value.size > 0) {
        if (!ALLOWED_MIME_TYPES.includes(value.type)) {
          return {
            error: fail('File type not supported. Allowed: JPEG, PNG, WebP, GIF, MP4, WebM, MOV', 415),
          };
        }
        if (value.size > MAX_FILE_SIZE) {
          return { error: fail('File too large. Maximum size is 50 MB', 413) };
        }
        const buffer = Buffer.from(await value.arrayBuffer());
        file = { buffer, mimetype: value.type, originalname: value.name };
      }
    }

    return { fields, file };
  }

  // JSON body
  try {
    const fields = await request.json();
    return { fields, file: null };
  } catch {
    return { fields: {}, file: null };
  }
}

// ─── Error handler ────────────────────────────────────────────────────────────

export function handleError(error) {
  // Mongoose duplicate key
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0] || 'field';
    const label = field.charAt(0).toUpperCase() + field.slice(1);
    return fail(`${label} already exists`, 409);
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors)
      .map((e) => e.message)
      .join(', ');
    return fail(message, 422);
  }

  // Mongoose bad ObjectId
  if (error.name === 'CastError') {
    return fail(`Invalid ${error.path}: ${error.value}`, 400);
  }

  logger.error(`Unhandled error: ${error.message}`, { stack: error.stack });
  return fail(
    process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error',
    500
  );
}
