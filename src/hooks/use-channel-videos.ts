import { useInfiniteQuery } from "@tanstack/react-query";
import type {
  YouTubeSearchResponse,
  YouTubeVideosResponse,
} from "@/types/youtube";

interface ChannelVideosParams {
  channelId: string;
  maxResults?: number;
  order?: "date" | "viewCount" | "rating";
}

async function fetchChannelVideos({
  channelId,
  maxResults = 20,
  order = "date",
  pageToken,
}: ChannelVideosParams & { pageToken?: string }): Promise<{
  videos: Array<{
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    channelId: string;
    channelTitle: string;
    channelThumbnailUrl?: string;
    publishedAt: string;
    viewCount?: string;
    duration?: string;
  }>;
  nextPageToken?: string;
}> {
  const searchParams = new URLSearchParams({
    maxResults: maxResults.toString(),
    order,
    ...(pageToken && { pageToken }),
  });

  const response = await fetch(
    `/api/youtube/channels/${channelId}/videos?${searchParams}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch channel videos");
  }

  const searchData: YouTubeSearchResponse = await response.json();

  const videoIds = searchData.items
    .filter((item) => item.id.videoId)
    .map((item) => item.id.videoId!);

  if (videoIds.length === 0) {
    return { videos: [], nextPageToken: searchData.nextPageToken };
  }

  // Fetch full video details to get statistics and duration
  const videosResponse = await fetch(
    `/api/youtube/videos?id=${videoIds.join(",")}`
  );

  if (!videosResponse.ok) {
    throw new Error("Failed to fetch video details");
  }

  const videosData: YouTubeVideosResponse = await videosResponse.json();

  const videos = videosData.items.map((video) => ({
    id: video.id,
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnailUrl:
      video.snippet.thumbnails.high?.url ||
      video.snippet.thumbnails.medium.url,
    channelId: video.snippet.channelId,
    channelTitle: video.snippet.channelTitle,
    publishedAt: video.snippet.publishedAt,
    viewCount: video.statistics?.viewCount,
    duration: video.contentDetails?.duration,
  }));

  return {
    videos,
    nextPageToken: searchData.nextPageToken,
  };
}

export function useInfiniteChannelVideos(
  params: ChannelVideosParams,
  enabled = true
) {
  return useInfiniteQuery({
    queryKey: ["channels", params.channelId, "videos", params.order],
    queryFn: ({ pageParam }) =>
      fetchChannelVideos({ ...params, pageToken: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    initialPageParam: undefined as string | undefined,
    enabled: enabled && !!params.channelId,
    staleTime: 5 * 60 * 1000,
  });
}
