"use client";

import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { VideoMetadata } from "@/components/VideoMetadata";
import { CollapsibleDescription } from "@/components/CollapsibleDescription";
import { RelatedVideosSidebar } from "@/components/RelatedVideosSidebar";
import { useVideo } from "@/hooks/use-video";

const YouTubePlayer = dynamic(
  () => import("@/components/YouTubePlayer").then((mod) => ({ default: mod.YouTubePlayer })),
  {
    loading: () => (
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-white text-sm">Loading player...</div>
      </div>
    ),
    ssr: false,
  }
);

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;

  const { data: video, isLoading, error } = useVideo({ id: videoId });

  const handleRelatedVideoClick = (newVideoId: string) => {
    router.push(`/watch/${newVideoId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main id="main-content" className="pt-20 px-4 sm:px-6 lg:px-8 max-w-[2000px] mx-auto pb-8">
        {error && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center max-w-md">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Failed to Load Video
              </h2>
              <p className="text-gray-600 mb-6">
                {error instanceof Error ? error.message : "Unknown error occurred"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="cursor-pointer px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Back to Home
                </button>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="cursor-pointer px-6 py-2 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="w-full aspect-video bg-gray-200 rounded-lg animate-pulse" />
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
              </div>
            </div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex gap-2 animate-pulse">
                  <div className="w-40 aspect-video bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {video && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <YouTubePlayer videoId={videoId} />

              <VideoMetadata video={video} />

              <CollapsibleDescription description={video.description} />
            </div>

            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold mb-4">Related Videos</h2>
                <RelatedVideosSidebar
                  videoId={videoId}
                  onVideoClick={handleRelatedVideoClick}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
