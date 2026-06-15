/**
 * Extracts the YouTube video ID from various YouTube URL formats.
 * @param {string} url - The YouTube URL or ID.
 * @returns {string|null} - The video ID or null if invalid.
 */
export function getYouTubeId(url) {
  if (!url) return null;
  
  // If it's already an ID (11 chars, alphanumeric/dash/underscore)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  try {
    const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    
    // Handle youtu.be/ID
    if (parsedUrl.hostname === 'youtu.be') {
      return parsedUrl.pathname.slice(1);
    }
    
    // Handle youtube.com/watch?v=ID
    if (parsedUrl.hostname.includes('youtube.com')) {
      if (parsedUrl.pathname === '/watch') {
        return parsedUrl.searchParams.get('v');
      }
      if (parsedUrl.pathname.startsWith('/embed/')) {
        return parsedUrl.pathname.split('/')[2];
      }
      if (parsedUrl.pathname.startsWith('/v/')) {
        return parsedUrl.pathname.split('/')[2];
      }
    }
  } catch (e) {
    // Fallback to regex if URL parsing fails
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
  }

  return null;
}

/**
 * Checks if a channel is currently live and returns live video details.
 * @param {string} channelId - The YouTube channel ID.
 * @param {string} apiKey - The YouTube Data API key.
 * @param {string} referer - The HTTP referer header to forward.
 * @returns {Promise<{isLive: boolean, videoId: string|null, title: string|null}>}
 */
export async function fetchYouTubeLiveStatus(channelId, apiKey, referer = '') {
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&eventType=live&key=${apiKey}`;
    const headers = referer ? { 'Referer': referer } : {};
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`YouTube API returned status ${res.status}: ${errText}`);
    }
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      const item = data.items[0];
      return {
        isLive: true,
        videoId: item.id.videoId,
        title: item.snippet.title,
      };
    }
  } catch (error) {
    console.error('Error fetching YouTube live status:', error);
  }
  return { isLive: false, videoId: null, title: null };
}

/**
 * Retrieves the Uploads playlist ID for a given channel.
 * @param {string} channelId - The YouTube channel ID.
 * @param {string} apiKey - The YouTube Data API key.
 * @param {string} referer - The HTTP referer header to forward.
 * @returns {Promise<string|null>} - The playlist ID or null.
 */
export async function getUploadsPlaylistId(channelId, apiKey, referer = '') {
  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
    const headers = referer ? { 'Referer': referer } : {};
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`YouTube API channels returned status ${res.status}: ${errText}`);
    }
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].contentDetails?.relatedPlaylists?.uploads || null;
    }
  } catch (error) {
    console.error('Error fetching uploads playlist ID:', error);
  }
  return null;
}

/**
 * Fetches items from a YouTube playlist (with pagination support).
 * @param {string} playlistId - The playlist ID (usually the uploads playlist).
 * @param {string} apiKey - The YouTube Data API key.
 * @param {number} maxResults - Max results per page (max 50).
 * @param {string} pageToken - Token for the next page.
 * @param {string} referer - The HTTP referer header to forward.
 * @returns {Promise<{items: Array, nextPageToken: string|null}>}
 */
export async function fetchPlaylistItems(playlistId, apiKey, maxResults = 50, pageToken = '', referer = '') {
  try {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=${maxResults}&pageToken=${pageToken}&key=${apiKey}`;
    const headers = referer ? { 'Referer': referer } : {};
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`YouTube API playlistItems returned status ${res.status}: ${errText}`);
    }
    const data = await res.json();
    return {
      items: data.items || [],
      nextPageToken: data.nextPageToken || null,
    };
  } catch (error) {
    console.error('Error fetching playlist items:', error);
    return { items: [], nextPageToken: null };
  }
}

/**
 * Checks if a channel has any upcoming scheduled live streams.
 * @param {string} channelId - The YouTube channel ID.
 * @param {string} apiKey - The YouTube Data API key.
 * @param {string} referer - The HTTP referer header to forward.
 * @returns {Promise<{hasScheduled: boolean, videoId: string|null, title: string|null, scheduledStartTime: string|null}>}
 */
export async function fetchYouTubeUpcomingStatus(channelId, apiKey, referer = '') {
  try {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&eventType=upcoming&key=${apiKey}`;
    const headers = referer ? { 'Referer': referer } : {};
    const searchRes = await fetch(searchUrl, { headers });
    if (!searchRes.ok) {
      const errText = await searchRes.text();
      throw new Error(`YouTube API upcoming search returned status ${searchRes.status}: ${errText}`);
    }
    const searchData = await searchRes.json();
    
    if (searchData.items && searchData.items.length > 0) {
      const item = searchData.items[0];
      const videoId = item.id.videoId;
      const title = item.snippet.title;

      // Fetch the details to get the scheduled start time
      const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${apiKey}`;
      const videoRes = await fetch(videoUrl, { headers });
      if (!videoRes.ok) {
        const errText = await videoRes.text();
        throw new Error(`YouTube API video details returned status ${videoRes.status}: ${errText}`);
      }
      const videoData = await videoRes.json();
      if (videoData.items && videoData.items.length > 0) {
        const scheduledStartTime = videoData.items[0].liveStreamingDetails?.scheduledStartTime || null;
        return {
          hasScheduled: true,
          videoId,
          title,
          scheduledStartTime,
        };
      }
    }
  } catch (error) {
    console.error('Error fetching YouTube upcoming status:', error);
  }
  return { hasScheduled: false, videoId: null, title: null, scheduledStartTime: null };
}




