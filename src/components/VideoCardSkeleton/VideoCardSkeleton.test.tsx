import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { VideoCardSkeleton } from "./VideoCardSkeleton";

describe("VideoCardSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<VideoCardSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("has animate-pulse class for skeleton animation", () => {
    const { container } = render(<VideoCardSkeleton />);
    const article = container.querySelector("article");
    expect(article).toHaveClass("animate-pulse");
  });

  it("renders skeleton elements with proper aspect ratio", () => {
    const { container } = render(<VideoCardSkeleton />);
    const thumbnail = container.querySelector(".aspect-video");
    expect(thumbnail).toBeInTheDocument();
  });
});
