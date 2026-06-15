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

async function test() {
  loadEnv();
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  const referer = 'http://localhost:3000/';

  console.log('Testing YouTube Search API...');
  try {
    // 1. Channel Details
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${channelId}&key=${apiKey}`;
    const channelRes = await fetch(channelUrl, { headers: { 'Referer': referer } });
    const channelData = await channelRes.json();
    console.log('Channel details response:', JSON.stringify(channelData, null, 2));

    // 2. Search Videos
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&maxResults=5&order=date&key=${apiKey}`;
    const searchRes = await fetch(searchUrl, { headers: { 'Referer': referer } });
    const searchData = await searchRes.json();
    console.log('Search videos response:', JSON.stringify(searchData, null, 2));

  } catch (error) {
    console.error('Error during test:', error);
  }
}

test();
