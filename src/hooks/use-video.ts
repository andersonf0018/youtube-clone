import { useQuery } from "@tanstack/react-query";
import { youtubeClient } from "@/lib/youtube-client";
import type { VideoParams } from "@/types/youtube";

export function useVideo(params: VideoParams, enabled = true) {
  return useQuery({
    queryKey: ["videos", "detail", params.id],
    queryFn: () => youtubeClient.getVideo(params),
    enabled: enabled && !!params.id,
    staleTime: 10 * 60 * 1000,
  });
}
