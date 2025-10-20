"use client";

import { Navigation } from "@/components/Navigation";
import { VideoCard } from "@/components/VideoCard";
import { usePopularVideos } from "@/hooks/use-popular-videos";
import { useSearchStore } from "@/store/search-store";
import { usePlayerStore } from "@/store/player-store";
import {
  formatViewCount,
  formatDuration,
  formatTimeAgo,
} from "@/lib/utils/formatters";

export default function Home() {
  const { data: videos, isLoading, error } = usePopularVideos();
  const { addToHistory } = useSearchStore();
  const { setCurrentVideoId } = usePlayerStore();

  const handleSearch = (query: string) => {
    addToHistory(query);
  };

  const handleVideoClick = (videoId: string) => {
    setCurrentVideoId(videoId);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation onSearch={handleSearch} />

      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-[2000px] mx-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
              <p className="mt-4 text-gray-600">Loading popular videos...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <p className="text-red-600 font-semibold">
                Failed to load videos
              </p>
              <p className="mt-2 text-gray-600 text-sm">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
              <p className="mt-4 text-gray-500 text-xs">
                Make sure your API routes are working. If YOUTUBE_API_KEY is
                not set, mock data will be used.
              </p>
            </div>
          </div>
        )}

        {!isLoading && !error && videos && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                title={video.title}
                channelName={video.channelTitle}
                views={formatViewCount(video.viewCount)}
                uploadedAt={formatTimeAgo(video.publishedAt)}
                duration={formatDuration(video.duration)}
                thumbnailUrl={video.thumbnailUrl}
                onClick={() => handleVideoClick(video.id)}
              />
            ))}
          </div>
        )}

        {!isLoading && !error && videos && videos.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-600">No videos found</p>
          </div>
        )}
      </main>
    </div>
  );
}
