'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import YouTubeEmbed from '../YouTubeEmbed';

export default function SermonMedia({ message, title, thumbnail, isFeatured }) {
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const hasVideo = message.youtubeVideoId || message.videoFile;

  const buttonClasses = isFeatured 
    ? "w-16 h-16 md:w-20 md:h-20 bg-primary-600/90 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform duration-300"
    : "w-12 h-12 rounded-full bg-primary-600/90 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300";

  let videoUrl = '';
  if (message.videoFile) {
    videoUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '').replace('/api', '') || ''}${message.videoFile?.includes('/api/v1/media') ? '' : '/api/v1/media'}${message.videoFile}`;
  }

  if (isActive && hasVideo) {
    if (message.youtubeVideoId) {
      return (
        <div className={`relative w-full h-full aspect-video bg-black ${isFeatured ? 'rounded-3xl overflow-hidden' : ''}`}>
          <YouTubeEmbed
            videoId={message.youtubeVideoId}
            title={title}
            autoplay={true}
          />
        </div>
      );
    } else {
      return (
        <div className={`relative w-full h-full aspect-video bg-black ${isFeatured ? 'rounded-3xl overflow-hidden' : ''}`}>
          <video
            src={videoUrl}
            className="w-full h-full absolute inset-0 bg-black"
            controls
            autoPlay
          />
        </div>
      );
    }
  }

  return (
    <div 
      className={`relative w-full h-full aspect-video bg-gray-900 group cursor-pointer overflow-hidden ${isFeatured ? 'rounded-3xl shadow-md' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        if (hasVideo) {
          e.preventDefault();
          e.stopPropagation();
          setIsActive(true);
        }
      }}
    >
      <Image 
        src={thumbnail} 
        alt={title} 
        fill 
        className={`object-cover transition-opacity duration-300 ease-out z-10 ${isHovered && hasVideo ? 'opacity-0' : 'opacity-100'}`} 
      />
      
      {isHovered && hasVideo && !isActive && (
        <div className="absolute inset-0 z-0">
          {message.youtubeVideoId ? (
            <YouTubeEmbed
              videoId={message.youtubeVideoId}
              title={title}
              autoplay={true}
              mute={true}
              controls={false}
              loop={true}
              className="pointer-events-none"
            />
          ) : (
            <video
              src={videoUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          )}
        </div>
      )}

      {!isActive && (
        <div className={`absolute inset-0 bg-black/10 group-hover:bg-black/30 flex items-center justify-center transition-all duration-300 z-20`}>
          <div className={buttonClasses}>
            <Play size={isFeatured ? 36 : 24} className="ml-1" fill="currentColor" />
          </div>
        </div>
      )}
    </div>
  );
}
