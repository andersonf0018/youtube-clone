import type {
  YouTubeVideosResponse,
  YouTubeSearchResponse,
  YouTubeChannelsResponse,
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

async function fetchJSON<T>(
  url: string,
  signal?: AbortSignal
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      signal,
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
  async searchVideos(
    params: SearchParams,
    signal?: AbortSignal
  ): Promise<YouTubeSearchResponse> {
    const searchParams = new URLSearchParams({
      query: params.query,
      maxResults: String(params.maxResults ?? 20),
      type: "video",
      ...(params.pageToken && { pageToken: params.pageToken }),
      ...(params.order && { order: params.order }),
    });

    return fetchJSON<YouTubeSearchResponse>(
      `${API_BASE_URL}/search?${searchParams}`,
      signal
    );
  },

  async searchVideosWithPagination(params: SearchParams): Promise<{
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
    const response = await this.searchVideos(params);

    const videoIds = response.items
      .filter((item) => item.id.videoId)
      .map((item) => item.id.videoId!);

    if (videoIds.length === 0) {
      return { videos: [], nextPageToken: response.nextPageToken };
    }

    const detailedVideos = await this.getVideosByIds(videoIds);

    // Get unique channel IDs and fetch channel thumbnails
    const uniqueChannelIds = [
      ...new Set(detailedVideos.map((video) => video.channelId)),
    ];

    const channelsResponse = await fetchJSON<YouTubeChannelsResponse>(
      `/api/youtube/channels/${uniqueChannelIds.join(",")}`
    );

    const channelThumbnails = new Map(
      channelsResponse.items.map((channel) => [
        channel.id,
        channel.snippet.thumbnails.medium.url,
      ])
    );

    return {
      videos: detailedVideos.map((video) => ({
        id: video.id,
        title: video.title,
        description: video.description,
        thumbnailUrl: video.thumbnailUrl,
        channelId: video.channelId,
        channelTitle: video.channelTitle,
        channelThumbnailUrl: channelThumbnails.get(video.channelId),
        publishedAt: video.publishedAt,
        viewCount: video.viewCount,
        duration: video.duration,
      })),
      nextPageToken: response.nextPageToken,
    };
  },

  async getVideo(params: VideoParams): Promise<NormalizedVideo> {
    const response = await fetchJSON<YouTubeVideosResponse>(
      `${API_BASE_URL}/videos?id=${params.id}`
    );

    if (!response.items.length) {
      throw new YouTubeClientError("Video not found", 404);
    }

    const video = normalizeVideo(response.items[0]);

    // Fetch channel thumbnail
    try {
      const channelResponse = await fetchJSON<YouTubeChannelsResponse>(
        `/api/youtube/channels/${video.channelId}`
      );

      if (channelResponse.items.length > 0) {
        video.channelThumbnailUrl = channelResponse.items[0].snippet.thumbnails.medium.url;
      }
    } catch (error) {
      console.warn("Failed to fetch channel thumbnail:", error);
    }

    return video;
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

    const videos = response.items.map(normalizeVideo);

    // Get unique channel IDs and fetch channel thumbnails
    const uniqueChannelIds = [
      ...new Set(videos.map((video) => video.channelId)),
    ];

    try {
      const channelsResponse = await fetchJSON<YouTubeChannelsResponse>(
        `/api/youtube/channels/${uniqueChannelIds.join(",")}`
      );

      const channelThumbnails = new Map(
        channelsResponse.items.map((channel) => [
          channel.id,
          channel.snippet.thumbnails.medium.url,
        ])
      );

      // Add channel thumbnails to videos
      videos.forEach((video) => {
        video.channelThumbnailUrl = channelThumbnails.get(video.channelId);
      });
    } catch (error) {
      console.warn("Failed to fetch channel thumbnails:", error);
    }

    return {
      videos,
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

  async getRelatedVideos(params: {
    videoId: string;
    maxResults?: number;
    pageToken?: string;
  }): Promise<{
    videos: Array<{
      id: string;
      title: string;
      description: string;
      thumbnailUrl: string;
      channelId: string;
      channelTitle: string;
      publishedAt: string;
      viewCount?: string;
      duration?: string;
    }>;
    nextPageToken?: string;
  }> {
    const searchParams = new URLSearchParams({
      videoId: params.videoId,
      maxResults: String(params.maxResults ?? 20),
      ...(params.pageToken && { pageToken: params.pageToken }),
    });

    const response = await fetchJSON<YouTubeSearchResponse>(
      `${API_BASE_URL}/related?${searchParams}`
    );

    const videoIds = response.items
      .filter((item) => item.id.videoId)
      .map((item) => item.id.videoId!);

    if (videoIds.length === 0) {
      return { videos: [], nextPageToken: response.nextPageToken };
    }

    const detailedVideos = await this.getVideosByIds(videoIds);

    return {
      videos: detailedVideos.map((video) => ({
        id: video.id,
        title: video.title,
        description: video.description,
        thumbnailUrl: video.thumbnailUrl,
        channelId: video.channelId,
        channelTitle: video.channelTitle,
        publishedAt: video.publishedAt,
        viewCount: video.viewCount,
        duration: video.duration,
      })),
      nextPageToken: response.nextPageToken,
    };
  },
};

export type { YouTubeClientError };
