import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotFound from "./not-found";

vi.mock("@/components/Navigation", () => ({
  Navigation: () => <nav data-testid="navigation">Navigation</nav>,
}));

describe("NotFound Page", () => {
  it("should render 404 heading", () => {
    render(<NotFound />);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
  });

  it("should render error message", () => {
    render(<NotFound />);

    expect(
      screen.getByText(/the page you're looking for doesn't exist/i)
    ).toBeInTheDocument();
  });

  it("should render navigation component", () => {
    render(<NotFound />);

    expect(screen.getByTestId("navigation")).toBeInTheDocument();
  });

  it("should render back to home link", () => {
    render(<NotFound />);

    const homeLink = screen.getByRole("link", { name: /back to home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("should render go back button", async () => {
    const user = userEvent.setup();
    const mockHistoryBack = vi.fn();
    window.history.back = mockHistoryBack;

    render(<NotFound />);

    const goBackButton = screen.getByRole("button", { name: /go back/i });
    await user.click(goBackButton);

    expect(mockHistoryBack).toHaveBeenCalled();
  });

  it("should have proper accessibility", () => {
    render(<NotFound />);

    const homeLink = screen.getByRole("link", { name: /back to home/i });
    const goBackButton = screen.getByRole("button", { name: /go back/i });

    expect(homeLink).toBeInTheDocument();
    expect(goBackButton).toBeInTheDocument();
  });

  it("should render error icon", () => {
    const { container } = render(<NotFound />);

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
