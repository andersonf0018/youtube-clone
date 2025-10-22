import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { render, createMockSession } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { UserMenu } from "./UserMenu";
import * as NextAuth from "next-auth/react";

vi.mock("next-auth/react", async () => {
  const actual = await vi.importActual<typeof NextAuth>("next-auth/react");
  return {
    ...actual,
    signOut: vi.fn(),
  };
});

const mockSignOut = vi.mocked(NextAuth.signOut);

describe("UserMenu", () => {
  const mockSession = createMockSession();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render user avatar button", () => {
    render(<UserMenu session={mockSession} />);

    const button = screen.getByRole("button", { name: /user menu/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-haspopup", "true");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("should display user image when available", () => {
    render(<UserMenu session={mockSession} />);

    const avatar = screen.getByAltText(mockSession.user.name);
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", mockSession.user.image);
  });

  it("should display user initials when no image available", () => {
    const sessionWithoutImage = createMockSession({
      user: { ...mockSession.user, image: null },
    });

    render(<UserMenu session={sessionWithoutImage} />);

    expect(screen.getByText("T")).toBeInTheDocument();
  });

  it("should toggle dropdown on button click", async () => {
    const user = userEvent.setup();
    render(<UserMenu session={mockSession} />);

    const button = screen.getByRole("button", { name: /user menu/i });

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("should display user information in dropdown", async () => {
    const user = userEvent.setup();
    render(<UserMenu session={mockSession} />);

    const button = screen.getByRole("button", { name: /user menu/i });
    await user.click(button);

    expect(screen.getByText(mockSession.user.name)).toBeInTheDocument();
    expect(screen.getByText(mockSession.user.email)).toBeInTheDocument();
  });

  it("should display sign out button in dropdown", async () => {
    const user = userEvent.setup();
    render(<UserMenu session={mockSession} />);

    const button = screen.getByRole("button", { name: /user menu/i });
    await user.click(button);

    const signOutButton = screen.getByRole("menuitem", { name: /sign out/i });
    expect(signOutButton).toBeInTheDocument();
  });

  it("should call signOut when sign out button is clicked", async () => {
    const user = userEvent.setup();
    render(<UserMenu session={mockSession} />);

    const button = screen.getByRole("button", { name: /user menu/i });
    await user.click(button);

    const signOutButton = screen.getByRole("menuitem", { name: /sign out/i });
    await user.click(signOutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: "/" });
    });
  });

  it("should close dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    const { container } = render(<UserMenu session={mockSession} />);

    const button = screen.getByRole("button", { name: /user menu/i });
    await user.click(button);

    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.click(container);

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("should have proper accessibility attributes on dropdown", async () => {
    const user = userEvent.setup();
    render(<UserMenu session={mockSession} />);

    const button = screen.getByRole("button", { name: /user menu/i });
    await user.click(button);

    const menu = screen.getByRole("menu");
    expect(menu).toHaveAttribute("aria-orientation", "vertical");
  });

  it("should handle keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<UserMenu session={mockSession} />);

    const button = screen.getByRole("button", { name: /user menu/i });

    await user.tab();
    expect(button).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("should cleanup event listener on unmount", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<UserMenu session={mockSession} />);

    const button = screen.getByRole("button", { name: /user menu/i });
    await user.click(button);

    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function)
    );
  });
});
