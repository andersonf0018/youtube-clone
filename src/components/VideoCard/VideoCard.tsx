"use client";

import Image from "next/image";
import Link from "next/link";

interface VideoCardProps {
  title: string;
  channelName: string;
  channelId: string;
  channelThumbnailUrl?: string;
  views: string;
  uploadedAt: string;
  duration: string;
  thumbnailUrl?: string;
  onClick: () => void;
  hideChannelAvatar?: boolean;
}

export function VideoCard({
  title,
  channelName,
  channelId,
  channelThumbnailUrl,
  views,
  uploadedAt,
  duration,
  thumbnailUrl,
  onClick,
  hideChannelAvatar = false,
}: VideoCardProps) {
  return (
    <article className="group">
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onClick}
          className="relative w-full aspect-video bg-gray-200 rounded-xl overflow-hidden transition-all group-hover:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
          aria-label={`Watch ${title}`}
        >
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
        </button>

        <div className="flex gap-3">
          {!hideChannelAvatar && (
            <Link
              href={`/channel/${channelId}`}
              className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full cursor-pointer"
              aria-label={`Visit ${channelName} channel`}
            >
              {channelThumbnailUrl ? (
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={channelThumbnailUrl}
                    alt=""
                    fill
                    sizes="36px"
                    className="object-cover"
                    priority={false}
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
              )}
            </Link>
          )}

          <div className="flex flex-col flex-1 min-w-0 gap-0">
            <button
              type="button"
              onClick={onClick}
              className="text-left w-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded cursor-pointer"
              aria-label={`Watch ${title}`}
            >
              <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                {title}
              </h3>
            </button>

            <div className="mt-1 space-y-0.5">
              <Link
                href={`/channel/${channelId}`}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer focus:outline-none focus:underline block w-fit"
              >
                {channelName}
              </Link>
              <p className="text-sm text-gray-600">
                {views} • {uploadedAt}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
