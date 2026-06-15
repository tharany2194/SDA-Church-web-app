import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { authenticate, authorize, fail, ok } from '@/lib/apiHelpers';
import Message from '@/models/Message';
import { getUploadsPlaylistId, fetchPlaylistItems } from '@/lib/youtube';
import logger from '@/lib/logger';

// POST /api/v1/messages/sync
export async function POST(request) {
  try {
    // 1. Authenticate user
    const authResult = await authenticate(request);
    if (authResult.error) return authResult.error;

    // 2. Authorize role (admin, editor, volunteer)
    const roleErr = authorize(authResult.user, 'admin', 'editor', 'volunteer');
    if (roleErr) return roleErr;

    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    if (!apiKey || !channelId) {
      return fail('YouTube API configuration is missing on the server.', 500);
    }

    await connectDB();

    // 3. Get the upload playlist ID and referer
    const referer = request.headers.get('referer') || 'http://localhost:3000/';
    const playlistId = await getUploadsPlaylistId(channelId, apiKey, referer);
    if (!playlistId) {
      return fail('Could not locate the Uploads playlist for the configured YouTube channel.', 400);
    }

    let pageToken = '';
    const activeYoutubeVideoIds = [];
    let newCount = 0;
    let processedCount = 0;

    // 4. Fetch all uploaded videos, page by page
    do {
      const { items, nextPageToken } = await fetchPlaylistItems(playlistId, apiKey, 50, pageToken, referer);
      
      if (!items || items.length === 0) {
        break;
      }

      for (const item of items) {
        const videoId = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;
        if (!videoId) continue;

        const title = item.snippet?.title;
        if (title === 'Private video' || title === 'Deleted video') {
          continue;
        }

        activeYoutubeVideoIds.push(videoId);
        processedCount++;

        // Check if message already exists in DB
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

          // Auto-detect category from keywords
          let category = 'sermon';
          const cleanTitle = title.toLowerCase();
          const cleanDesc = description.toLowerCase();

          if (
            cleanTitle.includes('worship') || 
            cleanTitle.includes('song') || 
            cleanTitle.includes('வராது') || 
            cleanTitle.includes('ஆராதனை') || 
            cleanTitle.includes('பாடல்') || 
            cleanTitle.includes('துதி')
          ) {
            category = 'worship';
          } else if (
            cleanTitle.includes('testimony') || 
            cleanTitle.includes('சாட்சி') || 
            cleanTitle.includes('அனுபவம்')
          ) {
            category = 'testimony';
          } else if (
            cleanTitle.includes('study') || 
            cleanTitle.includes('teaching') || 
            cleanTitle.includes('பாடம்') || 
            cleanTitle.includes('வகுப்பு') || 
            cleanTitle.includes('போதனை')
          ) {
            category = 'teaching';
          }

          // Create the message
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
            createdBy: authResult.user.id,
          });

          newCount++;
        }
      }

      pageToken = nextPageToken;
    } while (pageToken);

    // 5. Deletion synchronization
    // Only proceed if we actually fetched videos to avoid clearing DB on API failure/empty response
    let deletedCount = 0;
    if (activeYoutubeVideoIds.length > 0) {
      const deleteResult = await Message.deleteMany({
        youtubeVideoId: { $exists: true, $nin: activeYoutubeVideoIds },
      });
      deletedCount = deleteResult.deletedCount || 0;
    }

    logger.info(`YouTube Sync Completed. Processed: ${processedCount}, New: ${newCount}, Deleted: ${deletedCount}`);

    return ok({
      processedCount,
      newCount,
      deletedCount,
    });
  } catch (error) {
    logger.error(`Error during YouTube sync: ${error.message}`);
    return fail(error.message, 500);
  }
}
