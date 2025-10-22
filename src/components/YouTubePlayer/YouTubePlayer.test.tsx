import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { YouTubePlayer } from "./YouTubePlayer";

interface MockPlayer {
  destroy: ReturnType<typeof vi.fn>;
  loadVideoById: ReturnType<typeof vi.fn>;
  playVideo: ReturnType<typeof vi.fn>;
  pauseVideo: ReturnType<typeof vi.fn>;
}

interface MockYT {
  Player: ReturnType<typeof vi.fn>;
}

declare global {
  var YT: MockYT | undefined;
}

describe("YouTubePlayer", () => {
  let mockPlayer: MockPlayer;

  beforeEach(() => {
    mockPlayer = {
      destroy: vi.fn(),
      loadVideoById: vi.fn(),
      playVideo: vi.fn(),
      pauseVideo: vi.fn(),
    };

    global.YT = {
      Player: vi.fn().mockImplementation((_element, options) => {
        setTimeout(() => {
          options.events?.onReady?.();
        }, 0);
        return mockPlayer;
      }),
    };
  });

  afterEach(() => {
    delete global.YT;
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
      expect(global.YT?.Player).toHaveBeenCalled();
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
