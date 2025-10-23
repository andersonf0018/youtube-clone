"use client";

import { memo } from "react";
import Image from "next/image";
import { formatViewCount, formatTimeAgo } from "@/lib/utils/formatters";

interface RelatedVideoCardProps {
  title: string;
  channelName: string;
  views?: string;
  uploadedAt: string;
  duration?: string;
  thumbnailUrl: string;
  onClick: () => void;
}

export const RelatedVideoCard = memo(function RelatedVideoCard({
  title,
  channelName,
  views,
  uploadedAt,
  duration,
  thumbnailUrl,
  onClick,
}: RelatedVideoCardProps) {
  return (
    <article className="flex gap-2 group">
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer flex gap-2 w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
      >
        <div className="relative flex-shrink-0 w-40 aspect-video bg-gray-200 rounded-lg overflow-hidden">
          <Image
            src={thumbnailUrl}
            alt=""
            fill
            sizes="160px"
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {duration && (
            <span
              className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 text-white text-xs font-semibold rounded"
              aria-label={`Duration: ${duration}`}
            >
              {duration}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-gray-600">{channelName}</p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            {views && <span>{formatViewCount(views)}</span>}
            {views && uploadedAt && <span aria-hidden="true">•</span>}
            <span>{formatTimeAgo(uploadedAt)}</span>
          </div>
        </div>
      </button>
    </article>
  );
});
