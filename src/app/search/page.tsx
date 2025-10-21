"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { VideoGrid } from "@/components/VideoGrid";
import { VideoCardSkeleton } from "@/components/VideoCardSkeleton";
import { useInfiniteSearchVideos } from "@/hooks/use-search-videos";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useSearchStore } from "@/store/search-store";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const { setCurrentQuery } = useSearchStore();

  useEffect(() => {
    if (query) {
      setCurrentQuery(query);
    }
  }, [query, setCurrentQuery]);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSearchVideos(
    {
      query,
      maxResults: 20,
    },
    !!query
  );

  const { targetRef, isIntersecting } = useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleVideoClick = (videoId: string) => {
    router.push(`/watch/${videoId}`);
  };

  const allVideos =
    data?.pages.flatMap((page) => page.videos).reduce((unique, video) => {
      if (!unique.find((v) => v.id === video.id)) {
        unique.push(video);
      }
      return unique;
    }, [] as typeof data.pages[0]["videos"]) ?? [];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-[2000px] mx-auto pb-8">
        {!query && (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-500">Enter a search query to find videos</p>
          </div>
        )}

        {query && (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Search results for &quot;{query}&quot;
              </h1>
              {!isLoading && allVideos.length > 0 && (
                <p className="mt-1 text-sm text-gray-600">
                  {allVideos.length} video{allVideos.length !== 1 ? "s" : ""}{" "}
                  found
                </p>
              )}
            </div>

            {error && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center max-w-md">
                  <p className="text-red-600 font-semibold">
                    Failed to search videos
                  </p>
                  <p className="mt-2 text-gray-600 text-sm">
                    {error instanceof Error ? error.message : "Unknown error"}
                  </p>
                </div>
              </div>
            )}

            {!error && (
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

                <div ref={targetRef} className="h-20" aria-hidden="true" />

                {!isLoading && !hasNextPage && allVideos.length > 0 && (
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
