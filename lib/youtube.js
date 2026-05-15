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

