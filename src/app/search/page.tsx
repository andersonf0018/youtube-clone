"use client";

import { useEffect, Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { VideoGrid } from "@/components/VideoGrid";
import { VideoCardSkeleton } from "@/components/VideoCardSkeleton";
import { ChannelCard } from "@/components/ChannelCard";
import { useInfiniteSearchVideos } from "@/hooks/use-search-videos";
import { useInfiniteSearchChannels } from "@/hooks/use-search-channels";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useSearchStore } from "@/store/search-store";
import type { NormalizedChannel } from "@/types/youtube";

type SearchTab = "videos" | "channels";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const { setCurrentQuery } = useSearchStore();
  const [activeTab, setActiveTab] = useState<SearchTab>("videos");

  useEffect(() => {
    if (query) {
      setCurrentQuery(query);
    }
  }, [query, setCurrentQuery]);

  const {
    data: videoData,
    isLoading: videosLoading,
    error: videosError,
    fetchNextPage: fetchNextVideos,
    hasNextPage: hasNextVideosPage,
    isFetchingNextPage: isFetchingNextVideos,
  } = useInfiniteSearchVideos(
    {
      query,
      maxResults: 20,
    },
    !!query && activeTab === "videos"
  );

  const {
    data: channelData,
    isLoading: channelsLoading,
    error: channelsError,
    fetchNextPage: fetchNextChannels,
    hasNextPage: hasNextChannelsPage,
    isFetchingNextPage: isFetchingNextChannels,
  } = useInfiniteSearchChannels(
    {
      query,
      maxResults: 20,
      order: "relevance",
    },
    !!query && activeTab === "channels"
  );

  const { targetRef: videosTargetRef, isIntersecting: videosIntersecting } = useIntersectionObserver();
  const { targetRef: channelsTargetRef, isIntersecting: channelsIntersecting } = useIntersectionObserver();

  useEffect(() => {
    if (videosIntersecting && hasNextVideosPage && !isFetchingNextVideos) {
      fetchNextVideos();
    }
  }, [
    videosIntersecting,
    hasNextVideosPage,
    isFetchingNextVideos,
    fetchNextVideos,
  ]);

  useEffect(() => {
    if (channelsIntersecting && hasNextChannelsPage && !isFetchingNextChannels) {
      fetchNextChannels();
    }
  }, [
    channelsIntersecting,
    hasNextChannelsPage,
    isFetchingNextChannels,
    fetchNextChannels,
  ]);

  const handleVideoClick = (videoId: string) => {
    router.push(`/watch/${videoId}`);
  };

  const handleChannelClick = (channelId: string) => {
    router.push(`/channel/${channelId}`);
  };

  const allVideos =
    videoData?.pages
      .flatMap((page) => page.videos)
      .reduce((unique, video) => {
        if (!unique.find((v) => v.id === video.id)) {
          unique.push(video);
        }
        return unique;
      }, [] as typeof videoData.pages[0]["videos"]) ?? [];

  const allChannels =
    (
      channelData?.pages as Array<{
        channels: NormalizedChannel[];
        nextPageToken?: string;
      }>
    )
      ?.flatMap((page) => page.channels)
      .reduce(
        (unique, channel) => {
          if (!unique.find((c) => c.id === channel.id)) {
            unique.push(channel);
          }
          return unique;
        },
        [] as NormalizedChannel[]
      ) ?? [];

  const isLoading = activeTab === "videos" ? videosLoading : channelsLoading;
  const error = activeTab === "videos" ? videosError : channelsError;
  const hasNextPage =
    activeTab === "videos" ? hasNextVideosPage : hasNextChannelsPage;
  const isFetchingNextPage =
    activeTab === "videos" ? isFetchingNextVideos : isFetchingNextChannels;
  const resultCount = activeTab === "videos" ? allVideos.length : allChannels.length;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-[2000px] mx-auto pb-8">
        {!query && (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-500">
              Enter a search query to find videos and channels
            </p>
          </div>
        )}

        {query && (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Search results for &quot;{query}&quot;
              </h1>
              {!isLoading && resultCount > 0 && (
                <p className="mt-1 text-sm text-gray-600">
                  {resultCount} {activeTab === "videos" ? "video" : "channel"}
                  {resultCount !== 1 ? "s" : ""} found
                </p>
              )}
            </div>

            <div className="mb-6 border-b border-gray-200">
              <nav className="-mb-px flex gap-8" aria-label="Search tabs">
                <button
                  type="button"
                  onClick={() => setActiveTab("videos")}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer focus:outline-none ${
                    activeTab === "videos"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                  aria-current={activeTab === "videos" ? "page" : undefined}
                >
                  Videos
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("channels")}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer focus:outline-none ${
                    activeTab === "channels"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                  aria-current={activeTab === "channels" ? "page" : undefined}
                >
                  Channels
                </button>
              </nav>
            </div>

            {error && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center max-w-md">
                  <p className="text-red-600 font-semibold">
                    Failed to search {activeTab}
                  </p>
                  <p className="mt-2 text-gray-600 text-sm">
                    {error instanceof Error ? error.message : "Unknown error"}
                  </p>
                </div>
              </div>
            )}

            {!error && activeTab === "videos" && (
              <>
                <VideoGrid
                  videos={allVideos}
                  isLoading={isLoading}
                  onVideoClick={handleVideoClick}
                  skeletonCount={12}
                />

                {!isLoading && allVideos.length === 0 && (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <p className="text-gray-600 font-medium">
                        No videos found
                      </p>
                      <p className="mt-2 text-gray-500 text-sm">
                        Try adjusting your search query
                      </p>
                    </div>
                  </div>
                )}

                {isFetchingNextPage && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 mt-8">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <VideoCardSkeleton key={`loading-${index}`} />
                    ))}
                  </div>
                )}

                <div ref={videosTargetRef} className="h-20" aria-hidden="true" />

                {!isLoading && !hasNextPage && allVideos.length > 0 && (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-500 text-sm">
                      You&apos;ve reached the end
                    </p>
                  </div>
                )}
              </>
            )}

            {!error && activeTab === "channels" && (
              <>
                {isLoading && (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={`skeleton-${index}`}
                        className="flex gap-4 p-4 rounded-xl bg-gray-100 animate-pulse"
                      >
                        <div className="flex-shrink-0 w-32 h-32 rounded-full bg-gray-300" />
                        <div className="flex-1 space-y-3">
                          <div className="h-6 bg-gray-300 rounded w-1/3" />
                          <div className="h-4 bg-gray-300 rounded w-1/4" />
                          <div className="h-4 bg-gray-300 rounded w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!isLoading && allChannels.length > 0 && (
                  <div className="space-y-4">
                    {allChannels.map((channel) => (
                      <ChannelCard
                        key={channel.id}
                        id={channel.id}
                        title={channel.title}
                        description={channel.description}
                        thumbnailUrl={channel.thumbnailUrl}
                        subscriberCount={channel.subscriberCount}
                        onClick={() => handleChannelClick(channel.id)}
                      />
                    ))}
                  </div>
                )}

                {!isLoading && allChannels.length === 0 && (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <p className="text-gray-600 font-medium">
                        No channels found
                      </p>
                      <p className="mt-2 text-gray-500 text-sm">
                        Try adjusting your search query
                      </p>
                    </div>
                  </div>
                )}

                {isFetchingNextPage && (
                  <div className="space-y-4 mt-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={`loading-${index}`}
                        className="flex gap-4 p-4 rounded-xl bg-gray-100 animate-pulse"
                      >
                        <div className="flex-shrink-0 w-32 h-32 rounded-full bg-gray-300" />
                        <div className="flex-1 space-y-3">
                          <div className="h-6 bg-gray-300 rounded w-1/3" />
                          <div className="h-4 bg-gray-300 rounded w-1/4" />
                          <div className="h-4 bg-gray-300 rounded w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div ref={channelsTargetRef} className="h-20" aria-hidden="true" />

                {!isLoading && !hasNextPage && allChannels.length > 0 && (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-500 text-sm">
                      You&apos;ve reached the end
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white">
          <Navigation />
          <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-[2000px] mx-auto pb-8">
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-500">Loading...</p>
            </div>
          </main>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
