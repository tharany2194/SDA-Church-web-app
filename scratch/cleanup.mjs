import mongoose from 'mongoose';
import { connectDB } from '../lib/db.js';
import Message from '../models/Message.js';
import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envPath = path.resolve('.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const firstEq = trimmed.indexOf('=');
      if (firstEq === -1) continue;
      const key = trimmed.slice(0, firstEq).trim();
      const value = trimmed.slice(firstEq + 1).trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = value;
    }
  }
}

async function clean() {
  loadEnv();
  try {
    await connectDB();
    const ids = ['PquqdRi8I18', 'xQcbwGS6Ahc', '_C9Hq3Msd84', 'FPBwadTeph0', 'soY0UdjNOog'];
    const res = await Message.deleteMany({ youtubeVideoId: { $in: ids } });
    console.log(`Successfully deleted ${res.deletedCount} test messages.`);
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
  }
}

clean();
