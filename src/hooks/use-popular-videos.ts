import { useQuery } from "@tanstack/react-query";
import { youtubeClient } from "@/lib/youtube-client";
import type { PopularVideosParams } from "@/types/youtube";

export function usePopularVideos(params: PopularVideosParams = {}) {
  return useQuery({
    queryKey: ["videos", "popular", params],
    queryFn: () => youtubeClient.getPopularVideos(params),
    staleTime: 5 * 60 * 1000 * 60,
  });
}
