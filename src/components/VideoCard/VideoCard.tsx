"use client";

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
    <article className="flex flex-col gap-3 group">
      <button
        type="button"
        onClick={onClick}
        className="relative w-full aspect-video bg-gray-200 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer transition-all hover:rounded-lg"
        aria-label={`Play ${title}`}
      >
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
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
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 group-hover:text-gray-700 transition-colors cursor-pointer">
            {title}
          </h3>

          <div className="mt-1 space-y-0.5">
            <p className="text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
              {channelName}
            </p>
            <p className="text-sm text-gray-600">
              {views} • {uploadedAt}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
