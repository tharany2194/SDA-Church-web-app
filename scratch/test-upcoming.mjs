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

async function testUpcoming() {
  loadEnv();
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  const referer = 'http://localhost:3000/';

  console.log(`Checking upcoming streams for channel: ${channelId}`);
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&eventType=upcoming&key=${apiKey}`;
    const res = await fetch(url, { headers: { 'Referer': referer } });
    console.log('API Status:', res.status);
    const data = await res.json();
    console.log('YouTube API Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testUpcoming();
