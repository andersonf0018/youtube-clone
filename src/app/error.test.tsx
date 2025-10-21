import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GlobalError from "./error";

vi.mock("@/components/Navigation", () => ({
  Navigation: () => <nav data-testid="navigation">Navigation</nav>,
}));

describe("GlobalError Page", () => {
  const mockError = new Error("Test error message");
  const mockReset = vi.fn();

  it("should render error heading", () => {
    render(<GlobalError error={mockError} reset={mockReset} />);

    expect(screen.getByText(/oops! something went wrong/i)).toBeInTheDocument();
  });

  it("should render error description", () => {
    render(<GlobalError error={mockError} reset={mockReset} />);

    expect(
      screen.getByText(/an unexpected error occurred/i)
    ).toBeInTheDocument();
  });

  it("should render navigation component", () => {
    render(<GlobalError error={mockError} reset={mockReset} />);

    expect(screen.getByTestId("navigation")).toBeInTheDocument();
  });

  it("should call reset function when try again is clicked", async () => {
    const user = userEvent.setup();
    render(<GlobalError error={mockError} reset={mockReset} />);

    const tryAgainButton = screen.getByRole("button", { name: /try again/i });
    await user.click(tryAgainButton);

    expect(mockReset).toHaveBeenCalled();
  });

  it("should render back to home link", () => {
    render(<GlobalError error={mockError} reset={mockReset} />);

    const homeLink = screen.getByRole("link", { name: /back to home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("should log error to console on mount", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<GlobalError error={mockError} reset={mockReset} />);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Application error:",
      mockError
    );

    consoleErrorSpy.mockRestore();
  });

  it("should have proper accessibility", () => {
    render(<GlobalError error={mockError} reset={mockReset} />);

    const tryAgainButton = screen.getByRole("button", { name: /try again/i });
    const homeLink = screen.getByRole("link", { name: /back to home/i });

    expect(tryAgainButton).toBeInTheDocument();
    expect(homeLink).toBeInTheDocument();
  });

  it("should render error icon", () => {
    const { container } = render(<GlobalError error={mockError} reset={mockReset} />);

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
