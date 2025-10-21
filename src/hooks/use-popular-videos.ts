import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { youtubeClient } from "@/lib/youtube-client";
import type { PopularVideosParams } from "@/types/youtube";

export function usePopularVideos(params: PopularVideosParams = {}) {
  return useQuery({
    queryKey: ["videos", "popular", params],
    queryFn: async () => {
      const result = await youtubeClient.getPopularVideos(params);
      return result.videos;
    },
    staleTime: 5 * 60 * 1000 * 60,
  });
}

export function useInfinitePopularVideos(
  params: Omit<PopularVideosParams, "pageToken"> = {}
) {
  return useInfiniteQuery({
    queryKey: ["videos", "popular", "infinite", params],
    queryFn: ({ pageParam }) =>
      youtubeClient.getPopularVideos({
        ...params,
        pageToken: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    staleTime: 5 * 60 * 1000,
  });
}
