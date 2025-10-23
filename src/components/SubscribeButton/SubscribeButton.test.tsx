import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SubscribeButton } from "./SubscribeButton";
import { useSession } from "next-auth/react";
import { useSubscriptionStore } from "@/store/subscription-store";

vi.mock("next-auth/react");
vi.mock("@/store/subscription-store");

describe("SubscribeButton", () => {
  const mockSession = {
    user: { email: "test@example.com" },
  };

  const mockSubscribe = vi.fn();
  const mockUnsubscribe = vi.fn();
  const mockLoadSubscriptions = vi.fn();
  const mockIsSubscribed = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    (useSubscriptionStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      subscribe: mockSubscribe,
      unsubscribe: mockUnsubscribe,
      isSubscribed: mockIsSubscribed,
      loadSubscriptions: mockLoadSubscriptions,
    });

    mockIsSubscribed.mockReturnValue(false);
  });

  it("renders subscribe button when not subscribed", () => {
    render(
      <SubscribeButton channelId="test-channel" channelTitle="Test Channel" />
    );

    expect(screen.getByText("Subscribe")).toBeInTheDocument();
  });

  it("renders subscribed button when subscribed", () => {
    mockIsSubscribed.mockReturnValue(true);

    render(
      <SubscribeButton channelId="test-channel" channelTitle="Test Channel" />
    );

    expect(screen.getByText("Subscribed")).toBeInTheDocument();
  });

  it("shows login modal when clicking subscribe without authentication", async () => {
    render(
      <SubscribeButton channelId="test-channel" channelTitle="Test Channel" />
    );

    const button = screen.getByText("Subscribe");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Sign in required")).toBeInTheDocument();
    });
  });

  it("calls subscribe when authenticated user clicks subscribe", async () => {
    (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockSession,
      status: "authenticated",
    });

    mockSubscribe.mockResolvedValue(undefined);

    render(
      <SubscribeButton channelId="test-channel" channelTitle="Test Channel" />
    );

    const button = screen.getByText("Subscribe");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSubscribe).toHaveBeenCalledWith("test-channel");
    });
  });

  it("calls unsubscribe when clicking unsubscribe", async () => {
    (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockSession,
      status: "authenticated",
    });

    mockIsSubscribed.mockReturnValue(true);
    mockUnsubscribe.mockResolvedValue(undefined);

    render(
      <SubscribeButton channelId="test-channel" channelTitle="Test Channel" />
    );

    const button = screen.getByText("Subscribed");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockUnsubscribe).toHaveBeenCalledWith("test-channel");
    });
  });


  it("applies compact variant classes", () => {
    render(
      <SubscribeButton
        channelId="test-channel"
        channelTitle="Test Channel"
        variant="compact"
      />
    );

    const button = screen.getByRole("button", { name: /subscribe/i });
    expect(button).toHaveClass("px-4", "py-2");
  });

  it("applies default variant classes", () => {
    render(
      <SubscribeButton channelId="test-channel" channelTitle="Test Channel" />
    );

    const button = screen.getByRole("button", { name: /subscribe/i });
    expect(button).toHaveClass("px-6", "py-2");
  });
});

