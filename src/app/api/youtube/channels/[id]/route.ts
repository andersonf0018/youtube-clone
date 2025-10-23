import { NextRequest, NextResponse } from "next/server";
import type { YouTubeChannelsResponse } from "@/types/youtube";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Channel ID is required" },
      { status: 400 }
    );
  }

  try {
    if (!YOUTUBE_API_KEY) {
      console.warn(
        "YOUTUBE_API_KEY not set, returning mock data for channel(s):",
        id
      );
      return NextResponse.json(getMockChannelsResponse(id));
    }

    const channelParams = new URLSearchParams({
      part: "snippet,statistics,brandingSettings",
      id,
      key: YOUTUBE_API_KEY,
    });

    const response = await fetch(
      `${YOUTUBE_API_BASE}/channels?${channelParams}`
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error?.message || "YouTube API error" },
        { status: response.status }
      );
    }

    const data: YouTubeChannelsResponse = await response.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: "Channel not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Channel fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch channel" },
      { status: 500 }
    );
  }
}

function getMockChannelsResponse(ids: string): YouTubeChannelsResponse {
  const idArray = ids.split(",");

  const mockChannels = [
    {
      title: "Tech Academy",
      description: "Welcome to Tech Academy! We provide high-quality tutorials on programming, web development, and technology.",
      customUrl: "@techacademy",
      subscriberCount: "250000",
      videoCount: "450",
    },
    {
      title: "Code Masters",
      description: "Master coding with our comprehensive tutorials and real-world projects.",
      customUrl: "@codemasters",
      subscriberCount: "180000",
      videoCount: "320",
    },
    {
      title: "Dev Learning",
      description: "Learn web development, software engineering, and programming from scratch.",
      customUrl: "@devlearning",
      subscriberCount: "420000",
      videoCount: "580",
    },
  ];

  const items = idArray.map((id, index) => {
    const mockData = mockChannels[index % mockChannels.length];
    return {
      kind: "youtube#channel",
      etag: `mock-channel-etag-${index}`,
      id,
      snippet: {
        title: mockData.title,
        description: mockData.description,
        customUrl: mockData.customUrl,
        publishedAt: "2015-03-01T10:00:00Z",
        thumbnails: {
          default: {
            url: `https://yt3.ggpht.com/ytc/default-${index}.jpg`,
            width: 88,
            height: 88,
          },
          medium: {
            url: `https://yt3.ggpht.com/ytc/medium-${index}.jpg`,
            width: 240,
            height: 240,
          },
          high: {
            url: `https://yt3.ggpht.com/ytc/high-${index}.jpg`,
            width: 800,
            height: 800,
          },
        },
        country: "US",
      },
      statistics: {
        viewCount: "15000000",
        subscriberCount: mockData.subscriberCount,
        hiddenSubscriberCount: false,
        videoCount: mockData.videoCount,
      },
      brandingSettings: {
        channel: {
          title: mockData.title,
          description: mockData.description,
          keywords: "programming tutorials tech education coding",
        },
        image: {
          bannerExternalUrl: `https://yt3.ggpht.com/banner/channel-banner-${index}.jpg`,
        },
      },
    };
  });

  return {
    kind: "youtube#channelListResponse",
    etag: "mock-etag",
    pageInfo: {
      totalResults: items.length,
      resultsPerPage: items.length,
    },
    items,
  };
}
