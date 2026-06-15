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

async function list() {
  loadEnv();
  try {
    await connectDB();
    const messages = await Message.find({});
    console.log(`Total messages in DB: ${messages.length}`);
    for (const m of messages) {
      console.log(`- ID: ${m._id} | Title: "${m.title}" | isPublished: ${m.isPublished} | youtubeVideoId: ${m.youtubeVideoId}`);
    }
  } catch (error) {
    console.error('Error listing messages:', error);
  } finally {
    await mongoose.disconnect();
  }
}

list();
