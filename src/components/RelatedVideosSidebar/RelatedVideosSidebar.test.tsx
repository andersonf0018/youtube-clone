import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RelatedVideosSidebar } from "./RelatedVideosSidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/hooks/use-related-videos", () => ({
  useInfiniteRelatedVideos: vi.fn(),
}));

vi.mock("@/hooks/use-intersection-observer", () => ({
  useIntersectionObserver: vi.fn(() => ({
    targetRef: { current: null },
    isIntersecting: false,
  })),
}));

const { useInfiniteRelatedVideos } = await import("@/hooks/use-related-videos");

describe("RelatedVideosSidebar", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const mockVideos = [
    {
      id: "video-1",
      title: "Related Video 1",
      channelTitle: "Channel 1",
      thumbnailUrl: "https://example.com/thumb1.jpg",
      publishedAt: "2024-01-15T10:00:00Z",
      viewCount: "1000",
      duration: "PT5M30S",
    },
    {
      id: "video-2",
      title: "Related Video 2",
      channelTitle: "Channel 2",
      thumbnailUrl: "https://example.com/thumb2.jpg",
      publishedAt: "2024-01-14T10:00:00Z",
      viewCount: "2000",
      duration: "PT10M15S",
    },
  ];

  const renderWithClient = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  it("should render loading state", () => {
    vi.mocked(useInfiniteRelatedVideos).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    renderWithClient(
      <RelatedVideosSidebar videoId="test-id" onVideoClick={vi.fn()} />
    );

    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should render related videos", () => {
    vi.mocked(useInfiniteRelatedVideos).mockReturnValue({
      data: {
        pages: [{ videos: mockVideos, nextPageToken: undefined }],
        pageParams: [undefined],
      },
      isLoading: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    renderWithClient(
      <RelatedVideosSidebar videoId="test-id" onVideoClick={vi.fn()} />
    );

    expect(screen.getByText("Related Video 1")).toBeInTheDocument();
    expect(screen.getByText("Related Video 2")).toBeInTheDocument();
  });

  it("should render error state", () => {
    vi.mocked(useInfiniteRelatedVideos).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed to load"),
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    renderWithClient(
      <RelatedVideosSidebar videoId="test-id" onVideoClick={vi.fn()} />
    );

    expect(screen.getByText(/failed to load related videos/i)).toBeInTheDocument();
  });

  it("should call onVideoClick when video is clicked", async () => {
    const user = userEvent.setup();
    const onVideoClickMock = vi.fn();

    vi.mocked(useInfiniteRelatedVideos).mockReturnValue({
      data: {
        pages: [{ videos: mockVideos, nextPageToken: undefined }],
        pageParams: [undefined],
      },
      isLoading: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    renderWithClient(
      <RelatedVideosSidebar videoId="test-id" onVideoClick={onVideoClickMock} />
    );

    const videoButtons = screen.getAllByRole("button");
    await user.click(videoButtons[0]);

    expect(onVideoClickMock).toHaveBeenCalledWith("video-1");
  });

  it("should show empty state when no videos", () => {
    vi.mocked(useInfiniteRelatedVideos).mockReturnValue({
      data: {
        pages: [{ videos: [], nextPageToken: undefined }],
        pageParams: [undefined],
      },
      isLoading: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    renderWithClient(
      <RelatedVideosSidebar videoId="test-id" onVideoClick={vi.fn()} />
    );

    expect(screen.getByText(/no related videos found/i)).toBeInTheDocument();
  });

  it("should show loading state when fetching next page", () => {
    vi.mocked(useInfiniteRelatedVideos).mockReturnValue({
      data: {
        pages: [{ videos: mockVideos, nextPageToken: "next-token" }],
        pageParams: [undefined],
      },
      isLoading: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: true,
      isFetchingNextPage: true,
    } as any);

    renderWithClient(
      <RelatedVideosSidebar videoId="test-id" onVideoClick={vi.fn()} />
    );

    expect(screen.getByText("Related Video 1")).toBeInTheDocument();
    const loadingSkeletons = document.querySelectorAll(".animate-pulse");
    expect(loadingSkeletons.length).toBeGreaterThan(0);
  });

  it("should deduplicate videos across pages", () => {
    const duplicateVideos = [...mockVideos, mockVideos[0]];

    vi.mocked(useInfiniteRelatedVideos).mockReturnValue({
      data: {
        pages: [{ videos: duplicateVideos, nextPageToken: undefined }],
        pageParams: [undefined],
      },
      isLoading: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    renderWithClient(
      <RelatedVideosSidebar videoId="test-id" onVideoClick={vi.fn()} />
    );

    const video1Elements = screen.getAllByText("Related Video 1");
    expect(video1Elements).toHaveLength(1);
  });

  it("should render intersection observer target", () => {
    vi.mocked(useInfiniteRelatedVideos).mockReturnValue({
      data: {
        pages: [{ videos: mockVideos, nextPageToken: undefined }],
        pageParams: [undefined],
      },
      isLoading: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: true,
      isFetchingNextPage: false,
    } as any);

    const { container } = renderWithClient(
      <RelatedVideosSidebar videoId="test-id" onVideoClick={vi.fn()} />
    );

    const observerTarget = container.querySelector('[aria-hidden="true"]');
    expect(observerTarget).toBeInTheDocument();
  });
});
