import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navigation } from "./Navigation";

describe("Navigation", () => {
  it("should render navigation elements", () => {
    render(<Navigation onSearch={vi.fn()} />);

    expect(screen.getByRole("button", { name: /Menu/i })).toBeInTheDocument();
    expect(screen.getByRole("search")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search videos...")).toBeInTheDocument();
  });

  it("should display the logo and title", () => {
    render(<Navigation onSearch={vi.fn()} />);

    expect(screen.getByText("VideoTube")).toBeInTheDocument();
  });

  it("should update search input value", async () => {
    const user = userEvent.setup();
    render(<Navigation onSearch={vi.fn()} />);

    const searchInput = screen.getByPlaceholderText("Search videos...");
    await user.type(searchInput, "react tutorial");

    expect(searchInput).toHaveValue("react tutorial");
  });

  it("should call onSearch when form is submitted", async () => {
    const user = userEvent.setup();
    const onSearchMock = vi.fn();

    render(<Navigation onSearch={onSearchMock} />);

    const searchInput = screen.getByPlaceholderText("Search videos...");
    const searchButton = screen.getByRole("button", { name: /Search/i });

    await user.type(searchInput, "react tutorial");
    await user.click(searchButton);

    expect(onSearchMock).toHaveBeenCalledWith("react tutorial");
  });

  it("should call onSearch when Enter key is pressed", async () => {
    const user = userEvent.setup();
    const onSearchMock = vi.fn();

    render(<Navigation onSearch={onSearchMock} />);

    const searchInput = screen.getByPlaceholderText("Search videos...");

    await user.type(searchInput, "react tutorial{Enter}");

    expect(onSearchMock).toHaveBeenCalledWith("react tutorial");
  });

  it("should not call onSearch with empty query", async () => {
    const user = userEvent.setup();
    const onSearchMock = vi.fn();

    render(<Navigation onSearch={onSearchMock} />);

    const searchButton = screen.getByRole("button", { name: /Search/i });
    await user.click(searchButton);

    expect(onSearchMock).not.toHaveBeenCalled();
  });

  it("should trim whitespace from search query", async () => {
    const user = userEvent.setup();
    const onSearchMock = vi.fn();

    render(<Navigation onSearch={onSearchMock} />);

    const searchInput = screen.getByPlaceholderText("Search videos...");
    const searchButton = screen.getByRole("button", { name: /Search/i });

    await user.type(searchInput, "  react tutorial  ");
    await user.click(searchButton);

    expect(onSearchMock).toHaveBeenCalledWith("react tutorial");
  });

  it("should have proper accessibility attributes", () => {
    render(<Navigation onSearch={vi.fn()} />);

    const menuButton = screen.getByRole("button", { name: /Menu/i });
    const searchInput = screen.getByPlaceholderText("Search videos...");
    const searchButton = screen.getByRole("button", { name: /Search/i });

    expect(menuButton).toBeInTheDocument();
    expect(searchInput).toHaveAttribute("aria-label", "Search videos");
    expect(searchButton).toBeInTheDocument();
  });
});
