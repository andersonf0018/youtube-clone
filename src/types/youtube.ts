export interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface YouTubeThumbnails {
  default: YouTubeThumbnail;
  medium: YouTubeThumbnail;
  high: YouTubeThumbnail;
  standard?: YouTubeThumbnail;
  maxres?: YouTubeThumbnail;
}

export interface YouTubeVideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: YouTubeThumbnails;
  channelTitle: string;
  categoryId?: string;
  liveBroadcastContent?: string;
  tags?: string[];
}

export interface YouTubeVideoStatistics {
  viewCount: string;
  likeCount?: string;
  commentCount?: string;
}

export interface YouTubeVideoContentDetails {
  duration: string;
  dimension: string;
  definition: string;
  caption: string;
}

export interface YouTubeVideo {
  kind: string;
  etag: string;
  id: string;
  snippet: YouTubeVideoSnippet;
  statistics?: YouTubeVideoStatistics;
  contentDetails?: YouTubeVideoContentDetails;
}

export interface YouTubeSearchResultId {
  kind: string;
  videoId?: string;
  channelId?: string;
}

export interface YouTubeSearchResult {
  kind: string;
  etag: string;
  id: YouTubeSearchResultId;
  snippet: YouTubeVideoSnippet;
}

export interface YouTubeChannelSnippet {
  title: string;
  description: string;
  customUrl?: string;
  publishedAt: string;
  thumbnails: YouTubeThumbnails;
  country?: string;
}

export interface YouTubeChannelStatistics {
  viewCount: string;
  subscriberCount: string;
  hiddenSubscriberCount: boolean;
  videoCount: string;
}

export interface YouTubeChannelBrandingSettings {
  channel?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  image?: {
    bannerExternalUrl?: string;
  };
}

export interface YouTubeChannel {
  kind: string;
  etag: string;
  id: string;
  snippet: YouTubeChannelSnippet;
  statistics?: YouTubeChannelStatistics;
  brandingSettings?: YouTubeChannelBrandingSettings;
}

export interface YouTubePageInfo {
  totalResults: number;
  resultsPerPage: number;
}

export interface YouTubeListResponse<T> {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: YouTubePageInfo;
  items: T[];
}

export type YouTubeVideosResponse = YouTubeListResponse<YouTubeVideo>;
export type YouTubeSearchResponse = YouTubeListResponse<YouTubeSearchResult>;
export type YouTubeChannelsResponse = YouTubeListResponse<YouTubeChannel>;

export interface NormalizedVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelId: string;
  channelTitle: string;
  channelThumbnailUrl?: string;
  publishedAt: string;
  viewCount?: string;
  likeCount?: string;
  duration?: string;
}

export interface NormalizedChannel {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  customUrl?: string;
  subscriberCount: string;
  videoCount: string;
  publishedAt: string;
  bannerUrl?: string;
}

export type SearchOrder = "relevance" | "date" | "viewCount" | "rating";
export type SearchType = "video" | "channel";

export interface SearchParams {
  query: string;
  maxResults?: number;
  pageToken?: string;
  order?: SearchOrder;
  type?: SearchType;
}

export interface VideoParams {
  id: string;
}

export interface PopularVideosParams {
  regionCode?: string;
  maxResults?: number;
  pageToken?: string;
}

export interface ChannelParams {
  id: string;
}
