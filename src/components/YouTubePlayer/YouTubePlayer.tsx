"use client";

import { useEffect, useRef } from "react";

interface YouTubePlayerProps {
  videoId: string;
  onReady?: () => void;
  onError?: (error: number) => void;
}

export function YouTubePlayer({
  videoId,
  onReady,
  onError,
}: YouTubePlayerProps) {
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAPILoadedRef = useRef(false);

  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (isAPILoadedRef.current) return;

      if (typeof window.YT !== "undefined" && window.YT.Player) {
        isAPILoadedRef.current = true;
        return;
      }

      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        isAPILoadedRef.current = true;
      };
    };

    loadYouTubeAPI();
  }, []);

  useEffect(() => {
    const initPlayer = () => {
      if (!containerRef.current || !isAPILoadedRef.current) return;

      if (playerRef.current) {
        playerRef.current.loadVideoById(videoId);
        return;
      }

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            onReady?.();
          },
          onError: (event) => {
            onError?.(event.data);
          },
        },
      });
    };

    if (typeof window.YT !== "undefined" && window.YT.Player) {
      initPlayer();
    } else {
      const checkInterval = setInterval(() => {
        if (typeof window.YT !== "undefined" && window.YT.Player) {
          clearInterval(checkInterval);
          isAPILoadedRef.current = true;
          initPlayer();
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoId, onReady, onError]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}
