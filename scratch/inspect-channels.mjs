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

async function inspect() {
  loadEnv();
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = 'UC_x5XG1OV2P6uZZ5FSM9Ttw';
  const referer = 'http://localhost:3000/';

  console.log(`Inspecting channel: ${channelId}`);
  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&id=${channelId}&key=${apiKey}`;
    const res = await fetch(url, { headers: { 'Referer': referer } });
    console.log('Response status:', res.status);
    const text = await res.text();
    console.log('Response body:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

inspect();
