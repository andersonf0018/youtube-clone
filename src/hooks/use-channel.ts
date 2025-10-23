import { useQuery } from "@tanstack/react-query";
import type { YouTubeChannelsResponse, NormalizedChannel } from "@/types/youtube";

async function fetchChannel(id: string): Promise<NormalizedChannel> {
  const response = await fetch(`/api/youtube/channels/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch channel");
  }

  const data: YouTubeChannelsResponse = await response.json();

  if (!data.items || data.items.length === 0) {
    throw new Error("Channel not found");
  }

  const channel = data.items[0];

  return {
    id: channel.id,
    title: channel.snippet.title,
    description: channel.snippet.description,
    thumbnailUrl: channel.snippet.thumbnails.high.url,
    customUrl: channel.snippet.customUrl,
    subscriberCount: channel.statistics?.subscriberCount || "0",
    videoCount: channel.statistics?.videoCount || "0",
    publishedAt: channel.snippet.publishedAt,
    bannerUrl: channel.brandingSettings?.image?.bannerExternalUrl,
  };
}

export function useChannel(id: string) {
  return useQuery({
    queryKey: ["channel", id],
    queryFn: () => fetchChannel(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
