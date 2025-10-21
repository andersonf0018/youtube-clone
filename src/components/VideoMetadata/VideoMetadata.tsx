"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import type { NormalizedVideo } from "@/types/youtube";
import { formatViewCount, formatTimeAgo } from "@/lib/utils/formatters";

interface VideoMetadataProps {
  video: NormalizedVideo;
}

export function VideoMetadata({ video }: VideoMetadataProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (isSharing) return;

    setIsSharing(true);

    try {
      if (navigator.share) {
        await navigator.share({
          title: video.title,
          text: `Check out this video: ${video.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Error sharing:", error);
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-900 leading-tight">
        {video.title}
      </h1>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-600">
                {video.channelTitle.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {video.channelTitle}
              </h2>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            disabled={isSharing}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Share video"
          >
            <Share2 className="w-5 h-5" aria-hidden="true" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>{formatViewCount(video.viewCount)}</span>
        <span aria-hidden="true">•</span>
        <span>{formatTimeAgo(video.publishedAt)}</span>
      </div>
    </div>
  );
}
