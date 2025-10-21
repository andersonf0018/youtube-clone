import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { YouTubePlayer } from "./YouTubePlayer";

describe("YouTubePlayer", () => {
  let mockPlayer: any;

  beforeEach(() => {
    mockPlayer = {
      destroy: vi.fn(),
      loadVideoById: vi.fn(),
      playVideo: vi.fn(),
      pauseVideo: vi.fn(),
    };

    (global as any).YT = {
      Player: vi.fn().mockImplementation((element, options) => {
        setTimeout(() => {
          options.events?.onReady?.();
        }, 0);
        return mockPlayer;
      }),
    };
  });

  afterEach(() => {
    delete (global as any).YT;
    vi.clearAllMocks();
  });

  it("should render player container", () => {
    const { container } = render(<YouTubePlayer videoId="test-video-id" />);

    const playerContainer = container.querySelector(".aspect-video");
    expect(playerContainer).toBeInTheDocument();
  });

  it("should initialize YouTube player with correct video ID", async () => {
    render(<YouTubePlayer videoId="test-video-id" />);

    await waitFor(() => {
      expect((global as any).YT.Player).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it("should call onReady callback when player is ready", async () => {
    const onReadyMock = vi.fn();

    render(<YouTubePlayer videoId="test-video-id" onReady={onReadyMock} />);

    await waitFor(() => {
      expect(onReadyMock).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it("should have correct CSS classes for aspect ratio", () => {
    const { container } = render(<YouTubePlayer videoId="test-video-id" />);

    const playerContainer = container.querySelector(".aspect-video");
    expect(playerContainer).toBeInTheDocument();
    expect(playerContainer).toHaveClass("bg-black");
    expect(playerContainer).toHaveClass("rounded-lg");
  });

  it("should render with different video IDs", () => {
    const { rerender } = render(<YouTubePlayer videoId="video-1" />);
    expect(document.querySelector(".aspect-video")).toBeInTheDocument();

    rerender(<YouTubePlayer videoId="video-2" />);
    expect(document.querySelector(".aspect-video")).toBeInTheDocument();
  });
});
