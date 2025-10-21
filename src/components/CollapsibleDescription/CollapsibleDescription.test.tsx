import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CollapsibleDescription } from "./CollapsibleDescription";

describe("CollapsibleDescription", () => {
  const shortDescription = "This is a short description";
  const longDescription = `Line 1
Line 2
Line 3
Line 4
Line 5
Line 6`;

  it("should render description text", () => {
    render(<CollapsibleDescription description={shortDescription} />);

    expect(screen.getByText(shortDescription)).toBeInTheDocument();
  });

  it("should not render when description is empty", () => {
    const { container } = render(<CollapsibleDescription description="" />);

    expect(container.firstChild).toBeNull();
  });

  it("should not render when description is only whitespace", () => {
    const { container } = render(<CollapsibleDescription description="   " />);

    expect(container.firstChild).toBeNull();
  });

  it("should show toggle button for long descriptions", () => {
    render(<CollapsibleDescription description={longDescription} maxLines={3} />);

    const toggleButton = screen.getByRole("button", { name: /show more/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it("should not show toggle button for short descriptions", () => {
    render(
      <CollapsibleDescription description="Line 1\nLine 2" maxLines={3} />
    );

    const toggleButton = screen.queryByRole("button");
    expect(toggleButton).not.toBeInTheDocument();
  });

  it("should expand description when clicking show more", async () => {
    const user = userEvent.setup();
    render(<CollapsibleDescription description={longDescription} maxLines={3} />);

    const toggleButton = screen.getByRole("button", { name: /show more/i });
    await user.click(toggleButton);

    expect(screen.getByRole("button", { name: /show less/i })).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
  });

  it("should collapse description when clicking show less", async () => {
    const user = userEvent.setup();
    render(<CollapsibleDescription description={longDescription} maxLines={3} />);

    const showMoreButton = screen.getByRole("button", { name: /show more/i });
    await user.click(showMoreButton);

    const showLessButton = screen.getByRole("button", { name: /show less/i });
    await user.click(showLessButton);

    expect(screen.getByRole("button", { name: /show more/i })).toBeInTheDocument();
    expect(showLessButton).toHaveAttribute("aria-expanded", "false");
  });

  it("should preserve line breaks in description", () => {
    const multilineDescription = "Line 1\nLine 2\nLine 3";
    render(<CollapsibleDescription description={multilineDescription} />);

    const lines = screen.getAllByText(/Line \d/);
    expect(lines).toHaveLength(3);
  });

  it("should have correct accessibility attributes", () => {
    render(<CollapsibleDescription description={longDescription} maxLines={3} />);

    const toggleButton = screen.getByRole("button");
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    expect(toggleButton).toHaveAttribute("aria-label", "Show more");
  });

  it("should use default maxLines of 3", () => {
    render(<CollapsibleDescription description={longDescription} />);

    const toggleButton = screen.queryByRole("button");
    expect(toggleButton).toBeInTheDocument();
  });

  it("should use custom maxLines prop", () => {
    const description = "Line 1\nLine 2\nLine 3\nLine 4\nLine 5";
    render(<CollapsibleDescription description={description} maxLines={10} />);

    const toggleButton = screen.queryByRole("button");
    expect(toggleButton).not.toBeInTheDocument();
  });

  it("should render chevron down icon when collapsed", () => {
    render(<CollapsibleDescription description={longDescription} maxLines={3} />);

    const toggleButton = screen.getByRole("button", { name: /show more/i });
    expect(toggleButton).toHaveTextContent("Show more");
  });

  it("should render chevron up icon when expanded", async () => {
    const user = userEvent.setup();
    render(<CollapsibleDescription description={longDescription} maxLines={3} />);

    const toggleButton = screen.getByRole("button", { name: /show more/i });
    await user.click(toggleButton);

    expect(screen.getByRole("button", { name: /show less/i })).toHaveTextContent(
      "Show less"
    );
  });
});
