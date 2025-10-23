import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VideoCard } from "./VideoCard";

describe("VideoCard", () => {
  const defaultProps = {
    title: "Test Video Title",
    channelName: "Test Channel",
    channelId: "test-channel-id",
    channelThumbnailUrl: undefined,
    views: "1.2M views",
    uploadedAt: "2 days ago",
    duration: "15:32",
    onClick: vi.fn(),
  };

  it("should render video information correctly", () => {
    render(<VideoCard {...defaultProps} />);

    expect(screen.getByText("Test Video Title")).toBeInTheDocument();
    expect(screen.getByText("Test Channel")).toBeInTheDocument();
    expect(screen.getByText(/1.2M views/)).toBeInTheDocument();
    expect(screen.getByText(/2 days ago/)).toBeInTheDocument();
    expect(screen.getByText("15:32")).toBeInTheDocument();
  });

  it("should display thumbnail when provided", () => {
    render(<VideoCard {...defaultProps} thumbnailUrl="https://example.com/thumb.jpg" />);

    const buttons = screen.getAllByRole("button", { name: "Watch Test Video Title" });
    const thumbnailButton = buttons[0];
    const img = thumbnailButton.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", expect.stringContaining("thumb.jpg"));
  });

  it("should display placeholder when no thumbnail provided", () => {
    render(<VideoCard {...defaultProps} />);

    expect(screen.getByText("No thumbnail")).toBeInTheDocument();
  });

  it("should call onClick when video card is clicked", async () => {
    const user = userEvent.setup();
    const onClickMock = vi.fn();

    render(<VideoCard {...defaultProps} onClick={onClickMock} />);

    const buttons = screen.getAllByRole("button", { name: "Watch Test Video Title" });
    await user.click(buttons[0]);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it("should have proper accessibility attributes", () => {
    render(<VideoCard {...defaultProps} />);

    const buttons = screen.getAllByRole("button", { name: "Watch Test Video Title" });
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveAttribute("aria-label", "Watch Test Video Title");
    expect(buttons[1]).toHaveAttribute("aria-label", "Watch Test Video Title");

    const channelLink = screen.getByRole("link", { name: "Visit Test Channel channel" });
    expect(channelLink).toBeInTheDocument();
    expect(channelLink).toHaveAttribute("aria-label", "Visit Test Channel channel");
  });

  it("should display duration badge", () => {
    render(<VideoCard {...defaultProps} />);

    const durationBadge = screen.getByText("15:32");
    expect(durationBadge).toBeInTheDocument();
  });
});
