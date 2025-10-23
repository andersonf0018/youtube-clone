import { describe, it, expect, beforeEach, vi } from "vitest";
import { useSubscriptionStore } from "./subscription-store";

// Mock fetch
global.fetch = vi.fn();

describe("useSubscriptionStore", () => {
  beforeEach(() => {
    // Reset store before each test
    useSubscriptionStore.setState({
      subscriptions: new Set(),
      subscriberCounts: new Map(),
      isLoading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  it("should initialize with empty state", () => {
    const state = useSubscriptionStore.getState();
    expect(state.subscriptions.size).toBe(0);
    expect(state.subscriberCounts.size).toBe(0);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should check if channel is subscribed", () => {
    const { isSubscribed } = useSubscriptionStore.getState();
    expect(isSubscribed("channel1")).toBe(false);

    useSubscriptionStore.setState({
      subscriptions: new Set(["channel1"]),
    });

    expect(isSubscribed("channel1")).toBe(true);
    expect(isSubscribed("channel2")).toBe(false);
  });

  it("should set subscriber count", () => {
    const { setSubscriberCount, getSubscriberCount } =
      useSubscriptionStore.getState();

    setSubscriberCount("channel1", 1000);
    expect(getSubscriberCount("channel1", "0")).toBe("1000");
    expect(getSubscriberCount("channel2", "500")).toBe("500");
  });

  it("should subscribe to a channel", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ subscriberCount: 1001 }),
    });

    const { subscribe, isSubscribed } = useSubscriptionStore.getState();

    await subscribe("channel1");

    expect(isSubscribed("channel1")).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/subscriptions/subscribe",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: "channel1" }),
      })
    );
  });

  it("should unsubscribe from a channel", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ subscriberCount: 999 }),
    });

    useSubscriptionStore.setState({
      subscriptions: new Set(["channel1"]),
    });

    const { unsubscribe, isSubscribed } = useSubscriptionStore.getState();

    await unsubscribe("channel1");

    expect(isSubscribed("channel1")).toBe(false);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/subscriptions/unsubscribe",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: "channel1" }),
      })
    );
  });

  it("should handle subscribe error", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
    });

    const { subscribe } = useSubscriptionStore.getState();

    await expect(subscribe("channel1")).rejects.toThrow();
  });

  it("should load subscriptions", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ subscriptions: ["channel1", "channel2"] }),
    });

    const { loadSubscriptions, isSubscribed } = useSubscriptionStore.getState();

    await loadSubscriptions();

    expect(isSubscribed("channel1")).toBe(true);
    expect(isSubscribed("channel2")).toBe(true);
    expect(isSubscribed("channel3")).toBe(false);
  });
});

