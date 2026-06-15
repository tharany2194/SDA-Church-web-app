import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { connectDB } from '../lib/db.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { getUploadsPlaylistId, fetchPlaylistItems } from '../lib/youtube.js';

// 1. Parse .env.local to load env variables manually in node
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

async function run() {
  loadEnv();
  
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  
  console.log('YouTube API Key:', apiKey ? 'Loaded' : 'Missing');
  console.log('YouTube Channel ID:', channelId);

  if (!apiKey || !channelId) {
    console.error('Missing YouTube configurations.');
    process.exit(1);
  }

  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected.');

    // Find a creator user to attribute the synced messages to
    let creator = await User.findOne({ role: 'super_admin' });
    if (!creator) creator = await User.findOne({ role: 'admin' });
    if (!creator) creator = await User.findOne();
    
    if (!creator) {
      console.error('No users found in database. Please run seed or register a user first.');
      process.exit(1);
    }
    console.log(`Using creator: ${creator.name} (Role: ${creator.role}, ID: ${creator._id})`);

    const referer = 'http://localhost:3000/';
    const playlistId = await getUploadsPlaylistId(channelId, apiKey, referer);
    if (!playlistId) {
      console.error('Could not locate Uploads playlist.');
      process.exit(1);
    }
    console.log('Uploads Playlist ID:', playlistId);

    // Let's run a test sync for the first page (limit to 5 for test verification)
    console.log('Fetching first page of uploads (up to 5 items)...');
    const { items } = await fetchPlaylistItems(playlistId, apiKey, 5, '', referer);
    console.log(`Retrieved ${items.length} items from YouTube.`);

    const activeYoutubeVideoIds = [];
    let newCount = 0;

    for (const item of items) {
      const videoId = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;
      if (!videoId) continue;

      const title = item.snippet?.title;
      if (title === 'Private video' || title === 'Deleted video') {
        continue;
      }

      activeYoutubeVideoIds.push(videoId);
      console.log(`- Video ID: ${videoId} | Title: "${title}"`);

      const existingMessage = await Message.findOne({ youtubeVideoId: videoId });
      if (!existingMessage) {
        const thumbnails = item.snippet?.thumbnails || {};
        const thumbnail = thumbnails.maxres?.url || 
                          thumbnails.high?.url || 
                          thumbnails.medium?.url || 
                          thumbnails.standard?.url || 
                          thumbnails.default?.url || 
                          '/placeholder-sermon.jpg';

        const description = item.snippet?.description || title;

        // Auto-detect category
        let category = 'sermon';
        const cleanTitle = title.toLowerCase();
        if (cleanTitle.includes('worship') || cleanTitle.includes('song') || cleanTitle.includes('வராது')) {
          category = 'worship';
        } else if (cleanTitle.includes('testimony') || cleanTitle.includes('சாட்சி')) {
          category = 'testimony';
        } else if (cleanTitle.includes('study') || cleanTitle.includes('teaching') || cleanTitle.includes('பாடம்')) {
          category = 'teaching';
        }

        // Create in DB
        await Message.create({
          title,
          content: description,
          date: new Date(item.snippet?.publishedAt || Date.now()),
          youtubeVideoId: videoId,
          youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
          category,
          thumbnail,
          isPublished: true,
          isFeatured: false,
          createdBy: creator._id,
        });
        newCount++;
        console.log(`  -> Synced as NEW sermon (Category: ${category})`);
      } else {
        console.log('  -> Already exists in DB.');
      }
    }

    console.log(`Sync test finished. Imported ${newCount} new sermons.`);
  } catch (error) {
    console.error('Error during run:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database.');
  }
}

run();
