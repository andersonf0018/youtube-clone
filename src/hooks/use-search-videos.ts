import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { youtubeClient } from "@/lib/youtube-client";
import type { SearchParams } from "@/types/youtube";

export function useSearchVideos(params: SearchParams, enabled = true) {
  return useQuery({
    queryKey: ["videos", "search", params.query, params],
    queryFn: ({ signal }) => youtubeClient.searchVideos(params, signal),
    enabled: enabled && !!params.query,
    staleTime: 5 * 60 * 1000,
  });
}

export function useInfiniteSearchVideos(
  params: Omit<SearchParams, "pageToken">,
  enabled = true
) {
  return useInfiniteQuery({
    queryKey: ["videos", "search", "infinite", params.query, params],
    queryFn: ({ pageParam }) =>
      youtubeClient.searchVideosWithPagination({
        ...params,
        pageToken: pageParam,
      }),
    enabled: enabled && !!params.query,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    staleTime: 5 * 60 * 1000,
  });
}
