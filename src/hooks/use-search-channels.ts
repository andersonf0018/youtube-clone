import { useInfiniteQuery } from "@tanstack/react-query";
import type {
  YouTubeSearchResponse,
  YouTubeChannelsResponse,
  SearchParams,
  NormalizedChannel,
} from "@/types/youtube";

async function searchChannels({
  query,
  maxResults = 20,
  pageToken,
  order = "relevance",
}: SearchParams): Promise<{
  channels: NormalizedChannel[];
  nextPageToken?: string;
}> {
  const params = new URLSearchParams({
    query,
    maxResults: maxResults.toString(),
    order,
    ...(pageToken && { pageToken }),
  });

  const response = await fetch(`/api/youtube/channels?${params}`);

  if (!response.ok) {
    throw new Error("Failed to search channels");
  }

  const data: YouTubeSearchResponse = await response.json();

  const channelIds = data.items
    .filter((item) => item.id.channelId)
    .map((item) => item.id.channelId!);

  if (channelIds.length === 0) {
    return { channels: [], nextPageToken: data.nextPageToken };
  }

  // Fetch full channel details to get statistics
  const detailsResponse = await fetch(
    `/api/youtube/channels/${channelIds.join(",")}`
  );

  if (!detailsResponse.ok) {
    throw new Error("Failed to fetch channel details");
  }

  const detailsData: YouTubeChannelsResponse = await detailsResponse.json();

  const channels: NormalizedChannel[] = detailsData.items.map((channel) => ({
    id: channel.id,
    title: channel.snippet.title,
    description: channel.snippet.description,
    thumbnailUrl: channel.snippet.thumbnails.medium.url,
    customUrl: channel.snippet.customUrl,
    subscriberCount: channel.statistics?.subscriberCount || "0",
    videoCount: channel.statistics?.videoCount || "0",
    publishedAt: channel.snippet.publishedAt,
    bannerUrl: channel.brandingSettings?.image?.bannerExternalUrl,
  }));

  return {
    channels,
    nextPageToken: data.nextPageToken,
  };
}

export function useInfiniteSearchChannels(
  params: SearchParams,
  enabled = true
) {
  return useInfiniteQuery({
    queryKey: ["channels", "search", params.query, params.order],
    queryFn: ({ pageParam }) =>
      searchChannels({ ...params, pageToken: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    initialPageParam: undefined as string | undefined,
    enabled: enabled && !!params.query,
  });
}
