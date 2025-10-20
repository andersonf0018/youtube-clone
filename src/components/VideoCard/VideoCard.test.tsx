import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VideoCard } from "./VideoCard";

describe("VideoCard", () => {
  const defaultProps = {
    title: "Test Video Title",
    channelName: "Test Channel",
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

    const thumbnail = screen.getByRole("button", { name: /Play Test Video Title/i });
    const img = thumbnail.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/thumb.jpg");
  });

  it("should display placeholder when no thumbnail provided", () => {
    render(<VideoCard {...defaultProps} />);

    expect(screen.getByText("No thumbnail")).toBeInTheDocument();
  });

  it("should call onClick when video card is clicked", async () => {
    const user = userEvent.setup();
    const onClickMock = vi.fn();

    render(<VideoCard {...defaultProps} onClick={onClickMock} />);

    const button = screen.getByRole("button", { name: /Play Test Video Title/i });
    await user.click(button);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it("should have proper accessibility attributes", () => {
    render(<VideoCard {...defaultProps} />);

    const button = screen.getByRole("button", { name: /Play Test Video Title/i });
    expect(button).toBeInTheDocument();
  });

  it("should display duration badge", () => {
    render(<VideoCard {...defaultProps} />);

    const durationBadge = screen.getByText("15:32");
    expect(durationBadge).toBeInTheDocument();
  });
});
