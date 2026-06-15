import { NextResponse } from 'next/server';
import { fetchYouTubeLiveStatus, fetchYouTubeUpcomingStatus } from '@/lib/youtube';
import logger from '@/lib/logger';

// In-memory cache variables
let cachedStatus = null;
let cacheExpiry = 0;
const CACHE_DURATION_MS = 2 * 60 * 1000; // Cache for 2 minutes

export async function GET(request) {
  try {
    const now = Date.now();
    
    // Check if cache is still valid
    if (cachedStatus && now < cacheExpiry) {
      return NextResponse.json(cachedStatus);
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    if (!apiKey || !channelId) {
      logger.warn('YouTube API Key or Channel ID environment variable is missing.');
      return NextResponse.json({
        success: false,
        message: 'YouTube configuration is incomplete.',
        isLive: false,
        hasScheduled: false,
        videoId: null,
        title: null,
        scheduledStartTime: null,
      });
    }

    const referer = request.headers.get('referer') || 'http://localhost:3000/';
    
    // 1. Check if currently live
    const liveData = await fetchYouTubeLiveStatus(channelId, apiKey, referer);
    
    if (liveData.isLive) {
      cachedStatus = {
        success: true,
        isLive: true,
        hasScheduled: false,
        videoId: liveData.videoId,
        title: liveData.title,
        scheduledStartTime: null,
      };
    } else {
      // 2. Check if there is an upcoming scheduled livestream
      const upcomingData = await fetchYouTubeUpcomingStatus(channelId, apiKey, referer);
      
      cachedStatus = {
        success: true,
        isLive: false,
        hasScheduled: upcomingData.hasScheduled,
        videoId: upcomingData.videoId,
        title: upcomingData.title,
        scheduledStartTime: upcomingData.scheduledStartTime,
      };
    }
    
    cacheExpiry = now + CACHE_DURATION_MS;

    return NextResponse.json(cachedStatus);
  } catch (error) {
    logger.error(`Error in /api/v1/youtube/live-status: ${error.message}`);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve YouTube live status',
      isLive: false,
      videoId: null,
      title: null,
    }, { status: 500 });
  }
}
