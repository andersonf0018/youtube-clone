import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import VideoNotFound from "./not-found";

vi.mock("@/components/Navigation", () => ({
  Navigation: () => <nav data-testid="navigation">Navigation</nav>,
}));

describe("VideoNotFound Page", () => {
  it("should render video not found heading", () => {
    render(<VideoNotFound />);

    expect(screen.getByText("Video Not Found")).toBeInTheDocument();
  });

  it("should render error message", () => {
    render(<VideoNotFound />);

    expect(
      screen.getByText(/this video is unavailable/i)
    ).toBeInTheDocument();
  });

  it("should render navigation component", () => {
    render(<VideoNotFound />);

    expect(screen.getByTestId("navigation")).toBeInTheDocument();
  });

  it("should render browse videos link", () => {
    render(<VideoNotFound />);

    const browseLink = screen.getByRole("link", { name: /browse videos/i });
    expect(browseLink).toBeInTheDocument();
    expect(browseLink).toHaveAttribute("href", "/");
  });

  it("should render search for videos link", () => {
    render(<VideoNotFound />);

    const searchLink = screen.getByRole("link", { name: /search for videos/i });
    expect(searchLink).toBeInTheDocument();
    expect(searchLink).toHaveAttribute("href", "/search");
  });

  it("should render helpful tip", () => {
    render(<VideoNotFound />);

    expect(
      screen.getByText(/try searching for similar videos/i)
    ).toBeInTheDocument();
  });

  it("should render video off icon", () => {
    const { container } = render(<VideoNotFound />);

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should have proper accessibility", () => {
    render(<VideoNotFound />);

    const browseLink = screen.getByRole("link", { name: /browse videos/i });
    const searchLink = screen.getByRole("link", { name: /search for videos/i });

    expect(browseLink).toBeInTheDocument();
    expect(searchLink).toBeInTheDocument();
  });
});
