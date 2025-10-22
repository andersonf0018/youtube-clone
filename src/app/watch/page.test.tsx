import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WatchIndexPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

vi.mock("@/components/Navigation", () => ({
  Navigation: () => <nav data-testid="navigation">Navigation</nav>,
}));

describe("WatchIndexPage", () => {
  it("should render no video selected message", () => {
    render(<WatchIndexPage />);

    expect(screen.getByText("No Video Selected")).toBeInTheDocument();
  });

  it("should render description text", () => {
    render(<WatchIndexPage />);

    expect(
      screen.getByText(/please select a video to watch or search for content/i)
    ).toBeInTheDocument();
  });

  it("should render navigation component", () => {
    render(<WatchIndexPage />);

    expect(screen.getByTestId("navigation")).toBeInTheDocument();
  });

  it("should render go to home link", () => {
    render(<WatchIndexPage />);

    const homeLink = screen.getByRole("link", { name: /go to home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("should render search videos button", () => {
    render(<WatchIndexPage />);

    const searchButton = screen.getByRole("button", { name: /search videos/i });
    expect(searchButton).toBeInTheDocument();
  });

  it("should focus search input when search button is clicked", async () => {
    const user = userEvent.setup();
    const focusSpy = vi.fn();
    const mockSearchInput = document.createElement("input");
    mockSearchInput.type = "search";
    vi.spyOn(mockSearchInput, "focus").mockImplementation(focusSpy);
    vi.spyOn(document, "querySelector").mockReturnValue(mockSearchInput);

    render(<WatchIndexPage />);

    const searchButton = screen.getByRole("button", { name: /search videos/i });
    await user.click(searchButton);

    expect(focusSpy).toHaveBeenCalled();
  });

  it("should render tip about URL format", () => {
    render(<WatchIndexPage />);

    expect(screen.getByText(/tip:/i)).toBeInTheDocument();
    expect(screen.getByText("/watch/VIDEO_ID")).toBeInTheDocument();
  });

  it("should render video icon", () => {
    const { container } = render(<WatchIndexPage />);

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should have proper accessibility", () => {
    render(<WatchIndexPage />);

    const homeLink = screen.getByRole("link", { name: /go to home/i });
    const searchButton = screen.getByRole("button", { name: /search videos/i });

    expect(homeLink).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });
});
