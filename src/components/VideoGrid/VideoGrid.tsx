"use client";

import { useCallback } from "react";
import { VideoCard } from "@/components/VideoCard";
import { VideoCardSkeleton } from "@/components/VideoCardSkeleton";
import type { NormalizedVideo } from "@/types/youtube";
import {
  formatViewCount,
  formatDuration,
  formatTimeAgo,
} from "@/lib/utils/formatters";

interface VideoGridProps {
  videos: NormalizedVideo[];
  isLoading?: boolean;
  onVideoClick: (videoId: string) => void;
  skeletonCount?: number;
  hideChannelAvatar?: boolean;
}

export function VideoGrid({
  videos,
  isLoading = false,
  onVideoClick,
  skeletonCount = 12,
  hideChannelAvatar = false,
}: VideoGridProps) {
  const handleVideoClick = useCallback(
    (videoId: string) => () => onVideoClick(videoId),
    [onVideoClick]
  );
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-600">No videos found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          title={video.title}
          channelName={video.channelTitle}
          channelId={video.channelId}
          channelThumbnailUrl={video.channelThumbnailUrl}
          views={formatViewCount(video.viewCount)}
          uploadedAt={formatTimeAgo(video.publishedAt)}
          duration={formatDuration(video.duration)}
          thumbnailUrl={video.thumbnailUrl}
          onClick={handleVideoClick(video.id)}
          hideChannelAvatar={hideChannelAvatar}
        />
      ))}
    </div>
  );
}
