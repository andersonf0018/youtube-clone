"use client";

import { use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { VideoGrid } from "@/components/VideoGrid";
import { VideoCardSkeleton } from "@/components/VideoCardSkeleton";
import { useChannel } from "@/hooks/use-channel";
import { useInfiniteChannelVideos } from "@/hooks/use-channel-videos";
import { formatNumber } from "@/lib/utils/formatters";
import { useState } from "react";
import { SubscribeButton } from "@/components/SubscribeButton";

type ChannelTab = "home" | "about";

export default function ChannelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: channel, isLoading, error } = useChannel(id);
  const [activeTab, setActiveTab] = useState<ChannelTab>("home");

  const {
    data: videosData,
    isLoading: videosLoading,
    error: videosError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteChannelVideos(
    {
      channelId: id,
      maxResults: 20,
      order: "date",
    },
    !!id && activeTab === "home"
  );

  const allVideos =
    videosData?.pages
      .flatMap((page) => page.videos)
      .reduce((unique, video) => {
        if (!unique.find((v) => v.id === video.id)) {
          unique.push(video);
        }
        return unique;
      }, [] as typeof videosData.pages[0]["videos"]) ?? [];

  const handleVideoClick = (videoId: string) => {
    router.push(`/watch/${videoId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="pt-20">
          <div className="w-full h-48 bg-gray-200 animate-pulse" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-6 py-8">
              <div className="flex-shrink-0 w-40 h-40 rounded-full bg-gray-200 animate-pulse" />
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Channel not found
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              The channel you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        <Navigation />

        <main className="pt-16">
          {channel.bannerUrl && (
            <div className="relative w-full h-48 md:h-64 lg:h-72 bg-gradient-to-r from-blue-500 to-purple-600">
              <Image
                src={channel.bannerUrl}
                alt=""
                fill
                sizes="100vw"
                quality={90}
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 py-8">
              <div className="flex-shrink-0">
                <div className="relative w-40 h-40 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={channel.thumbnailUrl}
                    alt=""
                    fill
                    sizes="160px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {channel.title}
                </h1>

                {channel.customUrl && (
                  <p className="text-sm text-gray-600 mb-2">
                    {channel.customUrl}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span>{formatNumber(channel.subscriberCount)} subscribers</span>
                  <span>•</span>
                  <span>{formatNumber(channel.videoCount)} videos</span>
                </div>

                <SubscribeButton
                  channelId={id}
                  channelTitle={channel.title}
                />
              </div>
            </div>

            <div className="border-t border-gray-200">
              <nav className="-mb-px flex gap-8" aria-label="Channel tabs">
                <button
                  type="button"
                  onClick={() => setActiveTab("home")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer focus:outline-none ${
                    activeTab === "home"
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                  aria-current={activeTab === "home" ? "page" : undefined}
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("about")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer focus:outline-none ${
                    activeTab === "about"
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                  aria-current={activeTab === "about" ? "page" : undefined}
                >
                  About
                </button>
              </nav>
            </div>

            <div className="py-8">
              {activeTab === "about" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    About
                  </h2>
                  {channel.description ? (
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {channel.description}
                    </p>
                  ) : (
                    <p className="text-gray-500">No description available.</p>
                  )}
                </div>
              )}

              {activeTab === "home" && (
                <>
                  {videosError && (
                    <div className="flex items-center justify-center py-20">
                      <div className="text-center max-w-md">
                        <p className="text-red-600 font-semibold">
                          Failed to load videos
                        </p>
                        <p className="mt-2 text-gray-600 text-sm">
                          {videosError instanceof Error
                            ? videosError.message
                            : "Unknown error"}
                        </p>
                      </div>
                    </div>
                  )}

                  {!videosError && (
                    <>
                      <VideoGrid
                        videos={allVideos}
                        isLoading={videosLoading}
                        hideChannelAvatar={true}
                        onVideoClick={handleVideoClick}
                        skeletonCount={12}
                      />

                      {!videosLoading && allVideos.length === 0 && (
                        <div className="flex items-center justify-center py-20">
                          <p className="text-gray-600">
                            No videos uploaded yet
                          </p>
                        </div>
                      )}

                      {isFetchingNextPage && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 mt-8">
                          {Array.from({ length: 8 }).map((_, index) => (
                            <VideoCardSkeleton key={`loading-${index}`} />
                          ))}
                        </div>
                      )}

                      {!videosLoading && hasNextPage && (
                        <div className="flex items-center justify-center py-8">
                          <button
                            type="button"
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="px-6 py-3 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isFetchingNextPage ? "Loading..." : "View more"}
                          </button>
                        </div>
                      )}

                      {!videosLoading &&
                        !hasNextPage &&
                        allVideos.length > 0 && (
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
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
