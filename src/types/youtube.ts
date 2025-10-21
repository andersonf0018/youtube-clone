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
}

export interface YouTubeSearchResult {
  kind: string;
  etag: string;
  id: YouTubeSearchResultId;
  snippet: YouTubeVideoSnippet;
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

export interface NormalizedVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelId: string;
  channelTitle: string;
  publishedAt: string;
  viewCount?: string;
  likeCount?: string;
  duration?: string;
}

export type SearchOrder = "relevance" | "date" | "viewCount" | "rating";

export interface SearchParams {
  query: string;
  maxResults?: number;
  pageToken?: string;
  order?: SearchOrder;
}

export interface VideoParams {
  id: string;
}

export interface PopularVideosParams {
  regionCode?: string;
  maxResults?: number;
  pageToken?: string;
}
