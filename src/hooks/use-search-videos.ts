import { useQuery } from "@tanstack/react-query";
import { youtubeClient } from "@/lib/youtube-client";
import type { SearchParams } from "@/types/youtube";

export function useSearchVideos(params: SearchParams, enabled = true) {
  return useQuery({
    queryKey: ["videos", "search", params.query, params],
    queryFn: () => youtubeClient.searchVideos(params),
    enabled: enabled && !!params.query,
    staleTime: 5 * 60 * 1000 * 60,
  });
}
