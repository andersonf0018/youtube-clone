"use client";

import Image from "next/image";

interface VideoCardProps {
  title: string;
  channelName: string;
  views: string;
  uploadedAt: string;
  duration: string;
  thumbnailUrl?: string;
  onClick: () => void;
}

export function VideoCard({
  title,
  channelName,
  views,
  uploadedAt,
  duration,
  thumbnailUrl,
  onClick,
}: VideoCardProps) {
  return (
    <article className="group">
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl cursor-pointer"
        aria-label={`Watch ${title} by ${channelName}`}
      >
        <div className="flex flex-col gap-3">
          <div className="relative w-full aspect-video bg-gray-200 rounded-xl overflow-hidden transition-all group-hover:rounded-lg">
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                priority={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                <span className="text-gray-500 text-sm font-medium">
                  No thumbnail
                </span>
              </div>
            )}

            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white text-xs font-semibold rounded">
              {duration}
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                {title}
              </h3>

              <div className="mt-1 space-y-0.5">
                <p className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  {channelName}
                </p>
                <p className="text-sm text-gray-600">
                  {views} • {uploadedAt}
                </p>
              </div>
            </div>
          </div>
        </div>
      </button>
    </article>
  );
}
