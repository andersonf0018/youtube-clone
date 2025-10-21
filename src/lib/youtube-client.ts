import type {
  YouTubeVideosResponse,
  YouTubeSearchResponse,
  SearchParams,
  VideoParams,
  PopularVideosParams,
  NormalizedVideo,
} from "@/types/youtube";

const API_BASE_URL = "/api/youtube";

class YouTubeClientError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "YouTubeClientError";
  }
}

async function fetchJSON<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new YouTubeClientError(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof YouTubeClientError) {
      throw error;
    }
    throw new YouTubeClientError(
      error instanceof Error ? error.message : "Network request failed"
    );
  }
}

function normalizeVideo(
  video: YouTubeVideosResponse["items"][0]
): NormalizedVideo {
  return {
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
    likeCount: video.statistics?.likeCount,
    duration: video.contentDetails?.duration,
  };
}

export const youtubeClient = {
  async searchVideos(params: SearchParams): Promise<YouTubeSearchResponse> {
    const searchParams = new URLSearchParams({
      query: params.query,
      maxResults: String(params.maxResults ?? 20),
      ...(params.pageToken && { pageToken: params.pageToken }),
    });

    return fetchJSON<YouTubeSearchResponse>(
      `${API_BASE_URL}/search?${searchParams}`
    );
  },

  async getVideo(params: VideoParams): Promise<NormalizedVideo> {
    const response = await fetchJSON<YouTubeVideosResponse>(
      `${API_BASE_URL}/videos?id=${params.id}`
    );

    if (!response.items.length) {
      throw new YouTubeClientError("Video not found", 404);
    }

    return normalizeVideo(response.items[0]);
  },

  async getPopularVideos(
    params: PopularVideosParams = {}
  ): Promise<{
    videos: NormalizedVideo[];
    nextPageToken?: string;
  }> {
    const searchParams = new URLSearchParams({
      maxResults: String(params.maxResults ?? 20),
      ...(params.regionCode && { regionCode: params.regionCode }),
      ...(params.pageToken && { pageToken: params.pageToken }),
    });

    const response = await fetchJSON<YouTubeVideosResponse>(
      `${API_BASE_URL}/popular?${searchParams}`
    );

    return {
      videos: response.items.map(normalizeVideo),
      nextPageToken: response.nextPageToken,
    };
  },

  async getVideosByIds(ids: string[]): Promise<NormalizedVideo[]> {
    if (!ids.length) return [];

    const response = await fetchJSON<YouTubeVideosResponse>(
      `${API_BASE_URL}/videos?id=${ids.join(",")}`
    );

    return response.items.map(normalizeVideo);
  },
};

export type { YouTubeClientError };
