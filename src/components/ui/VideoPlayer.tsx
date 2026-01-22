'use client';

import { useEffect, useRef } from 'react';

interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  className?: string;
}

export function VideoPlayer({ src, className = '', ...props }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const loading = loadingRef.current;

    if (!video || !loading) return;

    const handleLoadedData = () => {
      loading.style.opacity = '0';
      loading.style.pointerEvents = 'none';
    };

    video.addEventListener('loadeddata', handleLoadedData);
    
    // If video is already loaded
    if (video.readyState >= 2) {
      handleLoadedData();
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className={`w-full h-full object-cover ${className}`}
        {...props}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div
        ref={loadingRef}
        className="absolute inset-0 bg-gray-800 flex items-center justify-center transition-opacity duration-500"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    </div>
  );
}
