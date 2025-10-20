import { NextRequest, NextResponse } from "next/server";
import type { YouTubeVideosResponse } from "@/types/youtube";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Video ID parameter is required" },
      { status: 400 }
    );
  }

  try {
    if (!YOUTUBE_API_KEY) {
      console.warn("YOUTUBE_API_KEY not set, returning mock data for video:", id);
      return NextResponse.json(getMockVideoResponse(id));
    }

    const params = new URLSearchParams({
      part: "snippet,contentDetails,statistics",
      id,
      key: YOUTUBE_API_KEY,
    });

    const response = await fetch(`${YOUTUBE_API_BASE}/videos?${params}`);

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error?.message || "YouTube API error" },
        { status: response.status }
      );
    }

    const data: YouTubeVideosResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Videos fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch video details" },
      { status: 500 }
    );
  }
}

function getMockVideoResponse(id: string): YouTubeVideosResponse {
  return {
    kind: "youtube#videoListResponse",
    etag: "mock-etag",
    pageInfo: {
      totalResults: 1,
      resultsPerPage: 1,
    },
    items: [
      {
        kind: "youtube#video",
        etag: "mock-video-etag",
        id,
        snippet: {
          publishedAt: "2024-01-15T10:00:00Z",
          channelId: "UCuAXFkgsw1L7xaCfnd5JJOw",
          title: "Building Modern Web Applications",
          description:
            "Learn how to build modern web applications with the latest technologies and best practices.",
          thumbnails: {
            default: {
              url: `https://i.ytimg.com/vi/${id}/default.jpg`,
              width: 120,
              height: 90,
            },
            medium: {
              url: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
              width: 320,
              height: 180,
            },
            high: {
              url: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
              width: 480,
              height: 360,
            },
            standard: {
              url: `https://i.ytimg.com/vi/${id}/sddefault.jpg`,
              width: 640,
              height: 480,
            },
          },
          channelTitle: "Tech Academy",
          tags: ["web development", "tutorial", "programming"],
          categoryId: "28",
        },
        contentDetails: {
          duration: "PT15M32S",
          dimension: "2d",
          definition: "hd",
          caption: "false",
        },
        statistics: {
          viewCount: "1234567",
          likeCount: "45678",
          commentCount: "1234",
        },
      },
    ],
  };
}
