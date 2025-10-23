import { NextRequest, NextResponse } from "next/server";
import type { YouTubeSearchResponse } from "@/types/youtube";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const maxResults = searchParams.get("maxResults") || "20";
  const pageToken = searchParams.get("pageToken");
  const order = searchParams.get("order") || "date";

  if (!id) {
    return NextResponse.json(
      { error: "Channel ID is required" },
      { status: 400 }
    );
  }

  try {
    if (!YOUTUBE_API_KEY) {
      console.warn(
        "YOUTUBE_API_KEY not set, returning mock data for channel videos:",
        id
      );
      return NextResponse.json(getMockChannelVideosResponse(id, pageToken));
    }

    const apiParams = new URLSearchParams({
      part: "snippet",
      channelId: id,
      type: "video",
      order,
      maxResults,
      key: YOUTUBE_API_KEY,
      ...(pageToken && { pageToken }),
    });

    const response = await fetch(`${YOUTUBE_API_BASE}/search?${apiParams}`);

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error?.message || "YouTube API error" },
        { status: response.status }
      );
    }

    const data: YouTubeSearchResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Channel videos fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch channel videos" },
      { status: 500 }
    );
  }
}

function getMockChannelVideosResponse(
  channelId: string,
  pageToken?: string | null
): YouTubeSearchResponse {
  const allMockVideos = [
    {
      kind: "youtube#searchResult" as const,
      etag: "mock-1",
      id: { kind: "youtube#video" as const, videoId: "channel-video-1" },
      snippet: {
        publishedAt: "2024-01-20T10:00:00Z",
        channelId,
        title: "Getting Started with Web Development",
        description: "Learn the fundamentals of web development in this comprehensive tutorial.",
        thumbnails: {
          default: { url: "https://i.ytimg.com/vi/channel-video-1/default.jpg", width: 120, height: 90 },
          medium: { url: "https://i.ytimg.com/vi/channel-video-1/mqdefault.jpg", width: 320, height: 180 },
          high: { url: "https://i.ytimg.com/vi/channel-video-1/hqdefault.jpg", width: 480, height: 360 },
        },
        channelTitle: "Tech Academy",
      },
    },
    {
      kind: "youtube#searchResult" as const,
      etag: "mock-2",
      id: { kind: "youtube#video" as const, videoId: "channel-video-2" },
      snippet: {
        publishedAt: "2024-01-18T14:30:00Z",
        channelId,
        title: "Advanced JavaScript Patterns",
        description: "Master advanced JavaScript patterns and best practices for modern development.",
        thumbnails: {
          default: { url: "https://i.ytimg.com/vi/channel-video-2/default.jpg", width: 120, height: 90 },
          medium: { url: "https://i.ytimg.com/vi/channel-video-2/mqdefault.jpg", width: 320, height: 180 },
          high: { url: "https://i.ytimg.com/vi/channel-video-2/hqdefault.jpg", width: 480, height: 360 },
        },
        channelTitle: "Tech Academy",
      },
    },
    {
      kind: "youtube#searchResult" as const,
      etag: "mock-3",
      id: { kind: "youtube#video" as const, videoId: "channel-video-3" },
      snippet: {
        publishedAt: "2024-01-15T09:15:00Z",
        channelId,
        title: "Building Scalable React Applications",
        description: "Learn how to build scalable React applications with modern architecture.",
        thumbnails: {
          default: { url: "https://i.ytimg.com/vi/channel-video-3/default.jpg", width: 120, height: 90 },
          medium: { url: "https://i.ytimg.com/vi/channel-video-3/mqdefault.jpg", width: 320, height: 180 },
          high: { url: "https://i.ytimg.com/vi/channel-video-3/hqdefault.jpg", width: 480, height: 360 },
        },
        channelTitle: "Tech Academy",
      },
    },
    {
      kind: "youtube#searchResult" as const,
      etag: "mock-4",
      id: { kind: "youtube#video" as const, videoId: "channel-video-4" },
      snippet: {
        publishedAt: "2024-01-12T11:00:00Z",
        channelId,
        title: "TypeScript Best Practices",
        description: "Discover TypeScript best practices for enterprise applications.",
        thumbnails: {
          default: { url: "https://i.ytimg.com/vi/channel-video-4/default.jpg", width: 120, height: 90 },
          medium: { url: "https://i.ytimg.com/vi/channel-video-4/mqdefault.jpg", width: 320, height: 180 },
          high: { url: "https://i.ytimg.com/vi/channel-video-4/hqdefault.jpg", width: 480, height: 360 },
        },
        channelTitle: "Tech Academy",
      },
    },
    {
      kind: "youtube#searchResult" as const,
      etag: "mock-5",
      id: { kind: "youtube#video" as const, videoId: "channel-video-5" },
      snippet: {
        publishedAt: "2024-01-10T15:30:00Z",
        channelId,
        title: "Node.js Performance Optimization",
        description: "Learn how to optimize Node.js applications for better performance.",
        thumbnails: {
          default: { url: "https://i.ytimg.com/vi/channel-video-5/default.jpg", width: 120, height: 90 },
          medium: { url: "https://i.ytimg.com/vi/channel-video-5/mqdefault.jpg", width: 320, height: 180 },
          high: { url: "https://i.ytimg.com/vi/channel-video-5/hqdefault.jpg", width: 480, height: 360 },
        },
        channelTitle: "Tech Academy",
      },
    },
    {
      kind: "youtube#searchResult" as const,
      etag: "mock-6",
      id: { kind: "youtube#video" as const, videoId: "channel-video-6" },
      snippet: {
        publishedAt: "2024-01-08T09:00:00Z",
        channelId,
        title: "CSS Grid Layout Masterclass",
        description: "Master CSS Grid Layout with practical examples and projects.",
        thumbnails: {
          default: { url: "https://i.ytimg.com/vi/channel-video-6/default.jpg", width: 120, height: 90 },
          medium: { url: "https://i.ytimg.com/vi/channel-video-6/mqdefault.jpg", width: 320, height: 180 },
          high: { url: "https://i.ytimg.com/vi/channel-video-6/hqdefault.jpg", width: 480, height: 360 },
        },
        channelTitle: "Tech Academy",
      },
    },
  ];

  // Simulate pagination
  if (!pageToken) {
    // First page - return first 3 videos with nextPageToken
    return {
      kind: "youtube#searchListResponse",
      etag: "mock-etag",
      nextPageToken: "mock-page-2",
      pageInfo: {
        totalResults: allMockVideos.length,
        resultsPerPage: 3,
      },
      items: allMockVideos.slice(0, 3),
    };
  } else if (pageToken === "mock-page-2") {
    // Second page - return next 3 videos
    return {
      kind: "youtube#searchListResponse",
      etag: "mock-etag",
      pageInfo: {
        totalResults: allMockVideos.length,
        resultsPerPage: 3,
      },
      items: allMockVideos.slice(3, 6),
    };
  }

  // No more pages
  return {
    kind: "youtube#searchListResponse",
    etag: "mock-etag",
    pageInfo: {
      totalResults: allMockVideos.length,
      resultsPerPage: 0,
    },
    items: [],
  };
}
