"use client";

import Image from "next/image";
import { formatNumber } from "@/lib/utils/formatters";
import { SubscribeButton } from "@/components/SubscribeButton";

interface ChannelCardProps {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: string;
  onClick: () => void;
}

export function ChannelCard({
  id,
  title,
  description,
  thumbnailUrl,
  subscriberCount,
  onClick,
}: ChannelCardProps) {

  return (
    <>
      <article className="group">
        <div className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
          <button
            type="button"
            onClick={onClick}
            className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full cursor-pointer"
            aria-label={`Visit ${title} channel`}
          >
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200">
              <Image
                src={thumbnailUrl}
                alt=""
                fill
                sizes="128px"
                className="object-cover"
                priority={false}
              />
            </div>
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <button
                type="button"
                onClick={onClick}
                className="flex-1 min-w-0 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded cursor-pointer"
                aria-label={`Visit ${title} channel`}
              >
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {title}
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  {formatNumber(subscriberCount)} subscribers
                </p>

                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {description}
                </p>
              </button>

              <SubscribeButton
                channelId={id}
                channelTitle={title}
                variant="compact"
                className="shrink-0"
              />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
