import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WatchError from "./error";

vi.mock("@/components/Navigation", () => ({
  Navigation: () => <nav data-testid="navigation">Navigation</nav>,
}));

describe("WatchError Page", () => {
  const mockError = new Error("Failed to load video");
  const mockReset = vi.fn();

  it("should render error heading", () => {
    render(<WatchError error={mockError} reset={mockReset} />);

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it("should render error message", () => {
    render(<WatchError error={mockError} reset={mockReset} />);

    expect(
      screen.getByText(/we encountered an error while loading this video/i)
    ).toBeInTheDocument();
  });

  it("should display error details", () => {
    render(<WatchError error={mockError} reset={mockReset} />);

    expect(screen.getByText("Failed to load video")).toBeInTheDocument();
  });

  it("should render navigation component", () => {
    render(<WatchError error={mockError} reset={mockReset} />);

    expect(screen.getByTestId("navigation")).toBeInTheDocument();
  });

  it("should call reset when try again is clicked", async () => {
    const user = userEvent.setup();
    render(<WatchError error={mockError} reset={mockReset} />);

    const tryAgainButton = screen.getByRole("button", { name: /try again/i });
    await user.click(tryAgainButton);

    expect(mockReset).toHaveBeenCalled();
  });

  it("should render back to home link", () => {
    render(<WatchError error={mockError} reset={mockReset} />);

    const homeLink = screen.getByRole("link", { name: /back to home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("should display error digest when available", () => {
    const errorWithDigest = new Error("Test error") as Error & { digest?: string };
    errorWithDigest.digest = "abc123";

    render(<WatchError error={errorWithDigest} reset={mockReset} />);

    expect(screen.getByText(/error id:/i)).toBeInTheDocument();
    expect(screen.getByText("abc123")).toBeInTheDocument();
  });

  it("should not display error digest when not available", () => {
    render(<WatchError error={mockError} reset={mockReset} />);

    expect(screen.queryByText(/error id:/i)).not.toBeInTheDocument();
  });

  it("should log error to console on mount", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<WatchError error={mockError} reset={mockReset} />);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Watch page error:", mockError);

    consoleErrorSpy.mockRestore();
  });

  it("should have proper accessibility", () => {
    render(<WatchError error={mockError} reset={mockReset} />);

    const tryAgainButton = screen.getByRole("button", { name: /try again/i });
    const homeLink = screen.getByRole("link", { name: /back to home/i });

    expect(tryAgainButton).toBeInTheDocument();
    expect(homeLink).toBeInTheDocument();
  });
});
