import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VideoMetadata } from "./VideoMetadata";
import type { NormalizedVideo } from "@/types/youtube";

describe("VideoMetadata", () => {
  const mockVideo: NormalizedVideo = {
    id: "test-id",
    title: "Test Video Title",
    description: "Test description",
    thumbnailUrl: "https://example.com/thumb.jpg",
    channelId: "channel-123",
    channelTitle: "Test Channel",
    publishedAt: "2024-01-15T10:00:00Z",
    viewCount: "1000000",
  };

  const mockWriteText = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    mockWriteText.mockClear();

    Object.defineProperty(window, "location", {
      value: {
        href: "http://localhost:3000/watch/test-id",
      },
      writable: true,
      configurable: true,
    });

    Object.defineProperty(window.navigator, "clipboard", {
      value: {
        writeText: mockWriteText,
      },
      writable: true,
      configurable: true,
    });

    delete (window.navigator as any).share;
  });

  it("should render video title", () => {
    render(<VideoMetadata video={mockVideo} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Test Video Title"
    );
  });

  it("should render channel information", () => {
    render(<VideoMetadata video={mockVideo} />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Test Channel"
    );
  });

  it("should display channel avatar with first letter", () => {
    render(<VideoMetadata video={mockVideo} />);

    expect(screen.getByText("T")).toBeInTheDocument();
  });

  it("should render view count", () => {
    render(<VideoMetadata video={mockVideo} />);

    expect(screen.getByText(/1.0M/)).toBeInTheDocument();
  });

  it("should render publish date", () => {
    render(<VideoMetadata video={mockVideo} />);

    expect(screen.getByText(/ago/i)).toBeInTheDocument();
  });

  it("should render share button", () => {
    render(<VideoMetadata video={mockVideo} />);

    const shareButton = screen.getByRole("button", { name: /share video/i });
    expect(shareButton).toBeInTheDocument();
  });

  it("should use Web Share API when available", async () => {
    const user = userEvent.setup();
    const mockShare = vi.fn().mockResolvedValue(undefined);
    (window as any).navigator.share = mockShare;

    render(<VideoMetadata video={mockVideo} />);

    const shareButton = screen.getByRole("button", { name: /share video/i });
    await user.click(shareButton);

    await waitFor(() => {
      expect(mockShare).toHaveBeenCalledWith({
        title: mockVideo.title,
        text: `Check out this video: ${mockVideo.title}`,
        url: expect.any(String),
      });
    });
  });

  it("should disable share button while sharing", async () => {
    const user = userEvent.setup();
    const mockShare = vi.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    (window as any).navigator.share = mockShare;

    render(<VideoMetadata video={mockVideo} />);

    const shareButton = screen.getByRole("button", { name: /share video/i });
    await user.click(shareButton);

    expect(shareButton).toBeDisabled();

    await waitFor(() => {
      expect(shareButton).not.toBeDisabled();
    });
  });

  it("should not share multiple times simultaneously", async () => {
    const user = userEvent.setup();
    let resolveShare: () => void;
    const mockShare = vi.fn().mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveShare = resolve;
        })
    );
    (window as any).navigator.share = mockShare;

    render(<VideoMetadata video={mockVideo} />);

    const shareButton = screen.getByRole("button", { name: /share video/i });

    const firstClick = user.click(shareButton);

    await waitFor(() => {
      expect(shareButton).toBeDisabled();
    });

    await user.click(shareButton);

    expect(mockShare).toHaveBeenCalledTimes(1);

    resolveShare!();
    await firstClick;
  });

  it("should handle share errors gracefully", async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const mockShare = vi.fn().mockRejectedValue(new Error("Share failed"));
    (window as any).navigator.share = mockShare;

    render(<VideoMetadata video={mockVideo} />);

    const shareButton = screen.getByRole("button", { name: /share video/i });
    await user.click(shareButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it("should not log error when user cancels share", async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const abortError = new Error("User cancelled");
    abortError.name = "AbortError";
    const mockShare = vi.fn().mockRejectedValue(abortError);
    (window as any).navigator.share = mockShare;

    render(<VideoMetadata video={mockVideo} />);

    const shareButton = screen.getByRole("button", { name: /share video/i });
    await user.click(shareButton);

    await waitFor(() => {
      expect(mockShare).toHaveBeenCalled();
    });

    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
