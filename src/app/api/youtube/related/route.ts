import { NextRequest, NextResponse } from "next/server";
import type {
  YouTubeSearchResponse,
  YouTubeVideo,
} from "@/types/youtube";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get("videoId");
  const maxResults = searchParams.get("maxResults") || "20";
  const pageToken = searchParams.get("pageToken");

  if (!videoId) {
    return NextResponse.json(
      { error: "videoId parameter is required" },
      { status: 400 }
    );
  }

  try {
    if (!YOUTUBE_API_KEY) {
      console.warn(
        "YOUTUBE_API_KEY not set, returning mock data for related videos:",
        videoId
      );
      return NextResponse.json(getMockRelatedResponse(videoId));
    }

    const params = new URLSearchParams({
      part: "snippet",
      chart: "mostPopular",
      videoCategoryId: "0",
      maxResults,
      key: YOUTUBE_API_KEY,
      ...(pageToken && { pageToken }),
    });

    const response = await fetch(`${YOUTUBE_API_BASE}/videos?${params}`);

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error?.message || "YouTube API error" },
        { status: response.status }
      );
    }

    const data = await response.json();

    const searchResponse: YouTubeSearchResponse = {
      kind: "youtube#searchListResponse",
      etag: data.etag,
      nextPageToken: data.nextPageToken,
      prevPageToken: data.prevPageToken,
      pageInfo: data.pageInfo,
      items: data.items.map((item: YouTubeVideo) => ({
        kind: "youtube#searchResult",
        etag: item.etag,
        id: {
          kind: "youtube#video",
          videoId: item.id,
        },
        snippet: item.snippet,
      })),
    };

    return NextResponse.json(searchResponse);
  } catch (error) {
    console.error("Related videos error:", error);
    return NextResponse.json(
      { error: "Failed to fetch related videos" },
      { status: 500 }
    );
  }
}

function getMockRelatedResponse(_videoId: string): YouTubeSearchResponse {
  return {
    kind: "youtube#searchListResponse",
    etag: "mock-etag",
    pageInfo: {
      totalResults: 5,
      resultsPerPage: 20,
    },
    items: [
      {
        kind: "youtube#searchResult",
        etag: "mock-1",
        id: {
          kind: "youtube#video",
          videoId: "related1",
        },
        snippet: {
          publishedAt: "2024-01-20T10:00:00Z",
          channelId: "UCrelatedChannel1",
          title: "Related Video 1 - Similar Content",
          description: "This is a related video that shares similar topics.",
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/related1/default.jpg",
              width: 120,
              height: 90,
            },
            medium: {
              url: "https://i.ytimg.com/vi/related1/mqdefault.jpg",
              width: 320,
              height: 180,
            },
            high: {
              url: "https://i.ytimg.com/vi/related1/hqdefault.jpg",
              width: 480,
              height: 360,
            },
          },
          channelTitle: "Related Channel 1",
        },
      },
      {
        kind: "youtube#searchResult",
        etag: "mock-2",
        id: {
          kind: "youtube#video",
          videoId: "related2",
        },
        snippet: {
          publishedAt: "2024-01-18T14:30:00Z",
          channelId: "UCrelatedChannel2",
          title: "Related Video 2 - You Might Like This",
          description: "Another video you might find interesting.",
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/related2/default.jpg",
              width: 120,
              height: 90,
            },
            medium: {
              url: "https://i.ytimg.com/vi/related2/mqdefault.jpg",
              width: 320,
              height: 180,
            },
            high: {
              url: "https://i.ytimg.com/vi/related2/hqdefault.jpg",
              width: 480,
              height: 360,
            },
          },
          channelTitle: "Related Channel 2",
        },
      },
      {
        kind: "youtube#searchResult",
        etag: "mock-3",
        id: {
          kind: "youtube#video",
          videoId: "related3",
        },
        snippet: {
          publishedAt: "2024-01-15T09:15:00Z",
          channelId: "UCrelatedChannel3",
          title: "Related Video 3 - Recommended",
          description: "A recommended video based on what you're watching.",
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/related3/default.jpg",
              width: 120,
              height: 90,
            },
            medium: {
              url: "https://i.ytimg.com/vi/related3/mqdefault.jpg",
              width: 320,
              height: 180,
            },
            high: {
              url: "https://i.ytimg.com/vi/related3/hqdefault.jpg",
              width: 480,
              height: 360,
            },
          },
          channelTitle: "Related Channel 3",
        },
      },
      {
        kind: "youtube#searchResult",
        etag: "mock-4",
        id: {
          kind: "youtube#video",
          videoId: "related4",
        },
        snippet: {
          publishedAt: "2024-01-12T11:00:00Z",
          channelId: "UCrelatedChannel4",
          title: "Related Video 4 - Popular Choice",
          description: "A popular video in this category.",
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/related4/default.jpg",
              width: 120,
              height: 90,
            },
            medium: {
              url: "https://i.ytimg.com/vi/related4/mqdefault.jpg",
              width: 320,
              height: 180,
            },
            high: {
              url: "https://i.ytimg.com/vi/related4/hqdefault.jpg",
              width: 480,
              height: 360,
            },
          },
          channelTitle: "Related Channel 4",
        },
      },
      {
        kind: "youtube#searchResult",
        etag: "mock-5",
        id: {
          kind: "youtube#video",
          videoId: "related5",
        },
        snippet: {
          publishedAt: "2024-01-08T16:45:00Z",
          channelId: "UCrelatedChannel5",
          title: "Related Video 5 - More Like This",
          description: "Discover more content like this video.",
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/related5/default.jpg",
              width: 120,
              height: 90,
            },
            medium: {
              url: "https://i.ytimg.com/vi/related5/mqdefault.jpg",
              width: 320,
              height: 180,
            },
            high: {
              url: "https://i.ytimg.com/vi/related5/hqdefault.jpg",
              width: 480,
              height: 360,
            },
          },
          channelTitle: "Related Channel 5",
        },
      },
    ],
  };
}
