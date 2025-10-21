import { NextRequest, NextResponse } from "next/server";
import type { YouTubeSearchResponse } from "@/types/youtube";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const maxResults = searchParams.get("maxResults") || "20";
  const pageToken = searchParams.get("pageToken");
  const order = searchParams.get("order") || "relevance";

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    if (!YOUTUBE_API_KEY) {
      console.warn(
        "YOUTUBE_API_KEY not set, returning mock data for search:",
        query
      );
      return NextResponse.json(getMockSearchResponse(query));
    }

    const params = new URLSearchParams({
      part: "snippet",
      q: query,
      type: "video",
      order,
      maxResults,
      key: YOUTUBE_API_KEY,
      ...(pageToken && { pageToken }),
    });

    const response = await fetch(`${YOUTUBE_API_BASE}/search?${params}`);

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
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search videos" },
      { status: 500 }
    );
  }
}

function getMockSearchResponse(query: string): YouTubeSearchResponse {
  return {
    kind: "youtube#searchListResponse",
    etag: "mock-etag",
    pageInfo: {
      totalResults: 3,
      resultsPerPage: 20,
    },
    items: [
      {
        kind: "youtube#searchResult",
        etag: "mock-1",
        id: {
          kind: "youtube#video",
          videoId: "dQw4w9WgXcQ",
        },
        snippet: {
          publishedAt: "2024-01-15T10:00:00Z",
          channelId: "UCuAXFkgsw1L7xaCfnd5JJOw",
          title: `${query} - Tutorial Part 1`,
          description: `Learn ${query} from scratch in this comprehensive tutorial.`,
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg",
              width: 120,
              height: 90,
            },
            medium: {
              url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
              width: 320,
              height: 180,
            },
            high: {
              url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
              width: 480,
              height: 360,
            },
          },
          channelTitle: "Tech Academy",
        },
      },
      {
        kind: "youtube#searchResult",
        etag: "mock-2",
        id: {
          kind: "youtube#video",
          videoId: "jNQXAC9IVRw",
        },
        snippet: {
          publishedAt: "2024-01-10T14:30:00Z",
          channelId: "UCuAXFkgsw1L7xaCfnd5JJOw",
          title: `Advanced ${query} Techniques`,
          description: `Master advanced ${query} patterns and best practices.`,
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/jNQXAC9IVRw/default.jpg",
              width: 120,
              height: 90,
            },
            medium: {
              url: "https://i.ytimg.com/vi/jNQXAC9IVRw/mqdefault.jpg",
              width: 320,
              height: 180,
            },
            high: {
              url: "https://i.ytimg.com/vi/jNQXAC9IVRw/hqdefault.jpg",
              width: 480,
              height: 360,
            },
          },
          channelTitle: "Code Masters",
        },
      },
      {
        kind: "youtube#searchResult",
        etag: "mock-3",
        id: {
          kind: "youtube#video",
          videoId: "9bZkp7q19f0",
        },
        snippet: {
          publishedAt: "2024-01-05T09:15:00Z",
          channelId: "UCuAXFkgsw1L7xaCfnd5JJOw",
          title: `${query} in Production - Real World Examples`,
          description: `See how ${query} is used in real production applications.`,
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/9bZkp7q19f0/default.jpg",
              width: 120,
              height: 90,
            },
            medium: {
              url: "https://i.ytimg.com/vi/9bZkp7q19f0/mqdefault.jpg",
              width: 320,
              height: 180,
            },
            high: {
              url: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
              width: 480,
              height: 360,
            },
          },
          channelTitle: "Production Ready",
        },
      },
    ],
  };
}
