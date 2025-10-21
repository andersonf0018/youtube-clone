"use client";

import { useEffect } from "react";
import { RelatedVideoCard } from "@/components/RelatedVideoCard";
import { useInfiniteRelatedVideos } from "@/hooks/use-related-videos";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { formatDuration } from "@/lib/utils/formatters";

interface RelatedVideosSidebarProps {
  videoId: string;
  onVideoClick: (videoId: string) => void;
}

export function RelatedVideosSidebar({
  videoId,
  onVideoClick,
}: RelatedVideosSidebarProps) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteRelatedVideos(videoId);

  const { targetRef, isIntersecting } = useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allVideos =
    data?.pages.flatMap((page) => page.videos).reduce((unique, video) => {
      if (!unique.find((v) => v.id === video.id)) {
        unique.push(video);
      }
      return unique;
    }, [] as typeof data.pages[0]["videos"]) ?? [];

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 text-sm font-medium">
          Failed to load related videos
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex gap-2 animate-pulse">
            <div className="w-40 aspect-video bg-gray-200 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {allVideos.map((video) => (
        <RelatedVideoCard
          key={video.id}
          title={video.title}
          channelName={video.channelTitle}
          views={video.viewCount}
          uploadedAt={video.publishedAt}
          duration={formatDuration(video.duration)}
          thumbnailUrl={video.thumbnailUrl}
          onClick={() => onVideoClick(video.id)}
        />
      ))}

      {isFetchingNextPage && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`loading-${index}`} className="flex gap-2 animate-pulse">
              <div className="w-40 aspect-video bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      <div ref={targetRef} className="h-10" aria-hidden="true" />

      {!isLoading && allVideos.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No related videos found</p>
        </div>
      )}
    </div>
  );
}
