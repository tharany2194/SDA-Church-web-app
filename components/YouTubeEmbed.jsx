'use client';
import { useEffect, useRef, useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';

export default function YouTubeEmbed({
  videoId,
  title = 'YouTube video',
  autoplay = false,
  mute = false,
  controls = true,
  loop = false,
  className = '',
}) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);

    const initPlayer = () => {
      if (!containerRef.current || !window.YT || !window.YT.Player) return;

      try {
        if (playerRef.current) {
          playerRef.current.destroy();
          playerRef.current = null;
        }

        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId: videoId,
          playerVars: {
            autoplay: autoplay ? 1 : 0,
            mute: mute ? 1 : 0,
            controls: controls ? 1 : 0,
            loop: loop ? 1 : 0,
            playlist: loop ? videoId : undefined,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
          },
          events: {
            onError: (event) => {
              console.warn('YouTube Player Error:', event.data);
              // 101 and 150 represent playback restrictions / disabled embedding
              if (event.data === 101 || event.data === 150) {
                setHasError(true);
              }
            },
          },
        });
      } catch (err) {
        console.error('Error initializing YouTube Player:', err);
      }
    };

    if (!window.YT) {
      let tag = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (!tag) {
        tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        initPlayer();
      };

      const checkInterval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkInterval);
          initPlayer();
        }
      }, 100);

      return () => clearInterval(checkInterval);
    } else {
      initPlayer();
    }

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, [videoId, autoplay, mute, controls, loop]);

  if (hasError) {
    return (
      <div className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 bg-gray-950 text-center text-white ${className}`}>
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-500 mb-4 animate-pulse">
          <Play size={20} />
        </div>
        <h3 className="text-base md:text-lg font-bold text-white mb-2">
          Playback Restricted by Owner
        </h3>
        <p className="text-xs md:text-sm text-white/60 mb-5 max-w-sm leading-relaxed">
          The owner of this video has disabled embedding on other websites. You can watch it directly on YouTube.
        </p>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md hover:-translate-y-0.5 transition-all text-xs sm:text-sm uppercase tracking-wider"
        >
          <span>Watch on YouTube</span>
          <ExternalLink size={14} />
        </a>
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 w-full h-full ${className}`}>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
