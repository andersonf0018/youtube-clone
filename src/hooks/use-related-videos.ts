import { useInfiniteQuery } from "@tanstack/react-query";
import { youtubeClient } from "@/lib/youtube-client";

export function useInfiniteRelatedVideos(videoId: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: ["videos", "related", videoId],
    queryFn: ({ pageParam }) =>
      youtubeClient.getRelatedVideos({
        videoId,
        maxResults: 10,
        pageToken: pageParam,
      }),
    enabled: enabled && !!videoId,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    staleTime: 10 * 60 * 1000,
  });
}
