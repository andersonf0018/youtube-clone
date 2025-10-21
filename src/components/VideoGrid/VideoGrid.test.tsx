import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { VideoGrid } from "./VideoGrid";
import type { NormalizedVideo } from "@/types/youtube";

const mockVideos: NormalizedVideo[] = [
  {
    id: "video-1",
    title: "Test Video 1",
    description: "Description 1",
    thumbnailUrl: "https://example.com/thumb1.jpg",
    channelId: "channel-1",
    channelTitle: "Test Channel",
    publishedAt: new Date().toISOString(),
    viewCount: "1000",
    duration: "PT5M30S",
  },
  {
    id: "video-2",
    title: "Test Video 2",
    description: "Description 2",
    thumbnailUrl: "https://example.com/thumb2.jpg",
    channelId: "channel-1",
    channelTitle: "Test Channel",
    publishedAt: new Date().toISOString(),
    viewCount: "2000",
    duration: "PT10M15S",
  },
];

describe("VideoGrid", () => {
  it("renders skeleton loaders when loading", () => {
    const { container } = render(
      <VideoGrid
        videos={[]}
        isLoading={true}
        onVideoClick={vi.fn()}
        skeletonCount={4}
      />
    );

    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons).toHaveLength(4);
  });

  it("renders videos when provided", () => {
    render(
      <VideoGrid videos={mockVideos} isLoading={false} onVideoClick={vi.fn()} />
    );

    expect(screen.getByText("Test Video 1")).toBeInTheDocument();
    expect(screen.getByText("Test Video 2")).toBeInTheDocument();
  });

  it("shows empty state when no videos", () => {
    render(
      <VideoGrid videos={[]} isLoading={false} onVideoClick={vi.fn()} />
    );

    expect(screen.getByText("No videos found")).toBeInTheDocument();
  });

  it("uses responsive grid layout", () => {
    const { container } = render(
      <VideoGrid videos={mockVideos} isLoading={false} onVideoClick={vi.fn()} />
    );

    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("grid-cols-1");
    expect(grid).toHaveClass("sm:grid-cols-2");
    expect(grid).toHaveClass("lg:grid-cols-3");
    expect(grid).toHaveClass("xl:grid-cols-4");
  });
});
