import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RelatedVideoCard } from "./RelatedVideoCard";

describe("RelatedVideoCard", () => {
  const defaultProps = {
    title: "Related Video Title",
    channelName: "Related Channel",
    views: "500K views",
    uploadedAt: "1 week ago",
    duration: "10:45",
    thumbnailUrl: "https://example.com/thumb.jpg",
    onClick: vi.fn(),
  };

  it("should render video information", () => {
    render(<RelatedVideoCard {...defaultProps} />);

    expect(screen.getByText("Related Video Title")).toBeInTheDocument();
    expect(screen.getByText("Related Channel")).toBeInTheDocument();
    expect(screen.getByText(/500K views/)).toBeInTheDocument();
    expect(screen.getByText(/1 week ago/)).toBeInTheDocument();
  });

  it("should render thumbnail image", () => {
    render(<RelatedVideoCard {...defaultProps} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", expect.stringContaining("thumb.jpg"));
  });

  it("should display duration badge", () => {
    render(<RelatedVideoCard {...defaultProps} />);

    expect(screen.getByText("10:45")).toBeInTheDocument();
  });

  it("should call onClick when card is clicked", async () => {
    const user = userEvent.setup();
    const onClickMock = vi.fn();

    render(<RelatedVideoCard {...defaultProps} onClick={onClickMock} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it("should render without views", () => {
    const { views, ...propsWithoutViews } = defaultProps;
    render(<RelatedVideoCard {...propsWithoutViews} uploadedAt="1 week ago" />);

    expect(screen.getByText(/1 week ago/)).toBeInTheDocument();
    expect(screen.queryByText("views")).not.toBeInTheDocument();
  });

  it("should render without duration", () => {
    const { duration, ...propsWithoutDuration } = defaultProps;
    render(<RelatedVideoCard {...propsWithoutDuration} />);

    expect(screen.getByText("Related Video Title")).toBeInTheDocument();
    expect(screen.queryByLabelText(/duration/i)).not.toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<RelatedVideoCard {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("cursor-pointer");
  });

  it("should truncate long titles", () => {
    const longTitle = "This is a very long video title that should be truncated";
    render(<RelatedVideoCard {...defaultProps} title={longTitle} />);

    const titleElement = screen.getByText(longTitle);
    expect(titleElement).toHaveClass("line-clamp-2");
  });

  it("should show separator between views and upload time", () => {
    render(<RelatedVideoCard {...defaultProps} />);

    expect(screen.getByText("500K views")).toBeInTheDocument();
    expect(screen.getByText("1 week ago")).toBeInTheDocument();
  });

  it("should have compact layout for sidebar", () => {
    const { container } = render(<RelatedVideoCard {...defaultProps} />);

    const thumbnail = container.querySelector(".w-40");
    expect(thumbnail).toBeInTheDocument();
  });

  it("should apply hover effects", () => {
    const { container } = render(<RelatedVideoCard {...defaultProps} />);

    const titleElement = screen.getByText("Related Video Title");
    expect(titleElement).toHaveClass("group-hover:text-blue-600");

    const img = container.querySelector("img");
    expect(img).toHaveClass("group-hover:scale-105");
  });
});
