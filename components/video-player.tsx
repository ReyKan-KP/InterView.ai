"use client"

import React, { useRef, useEffect, useState } from "react"

interface VideoPlayerProps {
  isBotSpeaking: boolean
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ isBotSpeaking }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const previousStateRef = useRef(isBotSpeaking)

  // Preload videos on mount
  useEffect(() => {
    // Preload both video files
    const talkingVideo = new Image();
    talkingVideo.src = "/video/talking-loop.mp4";
    
    const noddingVideo = new Image();
    noddingVideo.src = "/video/nodding.mp4";
    
    // Initialize with a video
    if (videoRef.current) {
      videoRef.current.src = isBotSpeaking 
        ? "/video/talking-loop.mp4"
        : "/video/nodding.mp4";
      videoRef.current.loop = true;
      videoRef.current.load();
    }
  }, []);

  // Handle speaking state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Only change video if the speaking state has actually changed
    if (previousStateRef.current !== isBotSpeaking) {
      console.log(`Speaking state changed: ${isBotSpeaking ? 'Bot speaking' : 'Bot listening'}`);
      previousStateRef.current = isBotSpeaking;
      
      // Set appropriate video source
      video.src = isBotSpeaking 
        ? "/video/talking-loop.mp4" 
        : "/video/nodding.mp4";
      
      // Ensure the video loops
      video.loop = true;
      
      // Load and play
      video.load();
      
      // Play when data is loaded
      const playWhenReady = () => {
        video.play()
          .then(() => console.log(`Playing ${isBotSpeaking ? 'talking' : 'nodding'} video`))
          .catch(err => {
            // Ignore abort errors from rapid source changes
            if (err.name !== 'AbortError') {
              console.error('Video play error:', err);
            }
          });
        
        // Remove listener to avoid duplicates
        video.removeEventListener('loadeddata', playWhenReady);
      };
      
      // Add event listener for when video data is loaded
      video.addEventListener('loadeddata', playWhenReady);
    }
  }, [isBotSpeaking]);

  // Handle errors
  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video error:", e);
    
    // Try to recover by reloading the video
    const video = videoRef.current;
    if (video) {
      setTimeout(() => {
        video.load();
        video.play().catch(err => console.log("Recovery attempt error:", err));
      }, 1000);
    }
  };

  return (
    <div className="rounded-lg overflow-hidden border shadow-md aspect-video max-w-md w-full mx-auto">
      <video 
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        loop
        onError={handleError}
      />
    </div>
  );
}; 