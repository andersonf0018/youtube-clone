import { NextRequest, NextResponse } from "next/server";
import type { YouTubeVideosResponse } from "@/types/youtube";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const maxResults = searchParams.get("maxResults") || "20";
  const regionCode = searchParams.get("regionCode") || "US";
  const pageToken = searchParams.get("pageToken");

  try {
    if (!YOUTUBE_API_KEY) {
      console.warn("YOUTUBE_API_KEY not set, returning mock popular videos");
      return NextResponse.json(getMockPopularVideos());
    }

    const params = new URLSearchParams({
      part: "snippet,contentDetails,statistics",
      chart: "mostPopular",
      regionCode,
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

    const data: YouTubeVideosResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Popular videos fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular videos" },
      { status: 500 }
    );
  }
}

function getMockPopularVideos(): YouTubeVideosResponse {
  const mockVideos = [
    {
      id: "dQw4w9WgXcQ",
      title: "Building a Modern Web Application with Next.js 15",
      channelTitle: "Web Dev Mastery",
      viewCount: "1234567",
      duration: "PT15M32S",
    },
    {
      id: "jNQXAC9IVRw",
      title: "Complete TypeScript Course for Beginners",
      channelTitle: "Code Academy",
      viewCount: "850234",
      duration: "PT45M18S",
    },
    {
      id: "9bZkp7q19f0",
      title: "React Server Components Explained",
      channelTitle: "Tech Insights",
      viewCount: "430567",
      duration: "PT12M45S",
    },
    {
      id: "oHg5SJYRHA0",
      title: "Tailwind CSS Tips and Tricks",
      channelTitle: "CSS Masters",
      viewCount: "920123",
      duration: "PT8M22S",
    },
    {
      id: "5qap5aO4i9A",
      title: "Advanced State Management in React",
      channelTitle: "React Patterns",
      viewCount: "650789",
      duration: "PT22M10S",
    },
  ];

  return {
    kind: "youtube#videoListResponse",
    etag: "mock-popular-etag",
    pageInfo: {
      totalResults: mockVideos.length,
      resultsPerPage: 20,
    },
    items: mockVideos.map((video, index) => ({
      kind: "youtube#video",
      etag: `mock-etag-${index}`,
      id: video.id,
      snippet: {
        publishedAt: new Date(Date.now() - index * 86400000).toISOString(),
        channelId: "UCuAXFkgsw1L7xaCfnd5JJOw",
        title: video.title,
        description: `Description for ${video.title}`,
        thumbnails: {
          default: {
            url: `https://i.ytimg.com/vi/${video.id}/default.jpg`,
            width: 120,
            height: 90,
          },
          medium: {
            url: `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`,
            width: 320,
            height: 180,
          },
          high: {
            url: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
            width: 480,
            height: 360,
          },
        },
        channelTitle: video.channelTitle,
        categoryId: "28",
      },
      contentDetails: {
        duration: video.duration,
        dimension: "2d",
        definition: "hd",
        caption: "false",
      },
      statistics: {
        viewCount: video.viewCount,
        likeCount: String(Math.floor(parseInt(video.viewCount) * 0.05)),
        commentCount: String(Math.floor(parseInt(video.viewCount) * 0.001)),
      },
    })),
  };
}
