import { memo } from "react";

export const VideoCardSkeleton = memo(function VideoCardSkeleton() {
  return (
    <article className="flex flex-col gap-3 animate-pulse">
      <div className="relative w-full aspect-video bg-gray-200 rounded-xl overflow-hidden" />

      <div className="flex gap-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-200" />

        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />

          <div className="space-y-1.5">
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    </article>
  );
});
