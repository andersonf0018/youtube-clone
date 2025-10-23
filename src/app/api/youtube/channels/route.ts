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
        "YOUTUBE_API_KEY not set, returning mock data for channel search:",
        query
      );
      return NextResponse.json(getMockChannelSearchResponse(query));
    }

    const params = new URLSearchParams({
      part: "snippet",
      q: query,
      type: "channel",
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
    console.error("Channel search error:", error);
    return NextResponse.json(
      { error: "Failed to search channels" },
      { status: 500 }
    );
  }
}

function getMockChannelSearchResponse(query: string): YouTubeSearchResponse {
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
        etag: "mock-channel-1",
        id: {
          kind: "youtube#channel",
          channelId: "UCJUmE61LxhbhudzqiYZTyAg",
        },
        snippet: {
          publishedAt: "2015-03-01T10:00:00Z",
          channelId: "UCJUmE61LxhbhudzqiYZTyAg",
          title: `${query} Academy`,
          description: `The ultimate destination for learning ${query}. Join millions of students mastering ${query} through our comprehensive tutorials and courses.`,
          thumbnails: {
            default: {
              url: "https://yt3.ggpht.com/ytc/default1.jpg",
              width: 88,
              height: 88,
            },
            medium: {
              url: "https://yt3.ggpht.com/ytc/medium1.jpg",
              width: 240,
              height: 240,
            },
            high: {
              url: "https://yt3.ggpht.com/ytc/high1.jpg",
              width: 800,
              height: 800,
            },
          },
          channelTitle: `${query} Academy`,
        },
      },
      {
        kind: "youtube#searchResult",
        etag: "mock-channel-2",
        id: {
          kind: "youtube#channel",
          channelId: "UCW6MNdOsqv2E7mjdGbGC16w",
        },
        snippet: {
          publishedAt: "2018-06-15T14:30:00Z",
          channelId: "UCW6MNdOsqv2E7mjdGbGC16w",
          title: `Tech ${query}`,
          description: `Exploring the world of ${query} with in-depth tutorials, tips, and tricks. Subscribe for weekly ${query} content!`,
          thumbnails: {
            default: {
              url: "https://yt3.ggpht.com/ytc/default2.jpg",
              width: 88,
              height: 88,
            },
            medium: {
              url: "https://yt3.ggpht.com/ytc/medium2.jpg",
              width: 240,
              height: 240,
            },
            high: {
              url: "https://yt3.ggpht.com/ytc/high2.jpg",
              width: 800,
              height: 800,
            },
          },
          channelTitle: `Tech ${query}`,
        },
      },
      {
        kind: "youtube#searchResult",
        etag: "mock-channel-3",
        id: {
          kind: "youtube#channel",
          channelId: "UCmtyQOKKmrMVaKuRXz02jbQ",
        },
        snippet: {
          publishedAt: "2020-01-10T09:15:00Z",
          channelId: "UCmtyQOKKmrMVaKuRXz02jbQ",
          title: `${query} Masters`,
          description: `Master ${query} from beginner to advanced. Professional tutorials, real-world projects, and expert insights on ${query}.`,
          thumbnails: {
            default: {
              url: "https://yt3.ggpht.com/ytc/default3.jpg",
              width: 88,
              height: 88,
            },
            medium: {
              url: "https://yt3.ggpht.com/ytc/medium3.jpg",
              width: 240,
              height: 240,
            },
            high: {
              url: "https://yt3.ggpht.com/ytc/high3.jpg",
              width: 800,
              height: 800,
            },
          },
          channelTitle: `${query} Masters`,
        },
      },
    ],
  };
}
