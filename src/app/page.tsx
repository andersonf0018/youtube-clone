"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { VideoGrid } from "@/components/VideoGrid";
import { VideoCardSkeleton } from "@/components/VideoCardSkeleton";
import { useInfinitePopularVideos } from "@/hooks/use-popular-videos";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export default function Home() {
  const router = useRouter();
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePopularVideos();
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

        {!error && (
          <>
            <VideoGrid
              videos={allVideos}
              isLoading={isLoading}
              onVideoClick={handleVideoClick}
              skeletonCount={12}
            />

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
      </main>
    </div>
  );
}
