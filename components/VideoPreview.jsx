'use client';
import { useRef, useState, useEffect } from 'react';

export default function VideoPreview({ src, className }) {
  const videoRef = useRef(null);
  const [middleTime, setMiddleTime] = useState(5);

  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      // Set to 30% into the video to avoid intros, capped at middle etc.
      const calcTime = Math.floor(videoRef.current.duration * 0.3);
      const targetTime = isFinite(calcTime) ? calcTime : 5;
      setMiddleTime(targetTime);
      videoRef.current.currentTime = targetTime;
    }
  };

  useEffect(() => {
    const parent = videoRef.current?.parentElement;
    if (!parent) return;

    const handleEnter = () => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    };

    const handleLeave = () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = middleTime;
      }
    };

    parent.addEventListener('mouseenter', handleEnter);
    parent.addEventListener('mouseleave', handleLeave);

    return () => {
      parent.removeEventListener('mouseenter', handleEnter);
      parent.removeEventListener('mouseleave', handleLeave);
    };
  }, [middleTime]);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      preload="metadata"
      muted
      playsInline
      loop
      onLoadedMetadata={handleLoadedMetadata}
    />
  );
}
