import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SubscriptionState {
  subscriptions: Set<string>; // Set of channel IDs
  subscriberCounts: Map<string, number>; // Map of channel ID to subscriber count
  isLoading: boolean;
  error: string | null;
  
  // Actions
  subscribe: (channelId: string) => Promise<void>;
  unsubscribe: (channelId: string) => Promise<void>;
  isSubscribed: (channelId: string) => boolean;
  getSubscriberCount: (channelId: string, defaultCount: string) => string;
  loadSubscriptions: () => Promise<void>;
  setSubscriberCount: (channelId: string, count: number) => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscriptions: new Set<string>(),
      subscriberCounts: new Map<string, number>(),
      isLoading: false,
      error: null,

      subscribe: async (channelId: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await fetch("/api/subscriptions/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ channelId }),
          });

          if (!response.ok) {
            throw new Error("Failed to subscribe");
          }

          const { subscriberCount } = await response.json();

          set((state) => {
            const newSubscriptions = new Set(state.subscriptions);
            newSubscriptions.add(channelId);
            
            const newCounts = new Map(state.subscriberCounts);
            if (subscriberCount !== undefined) {
              newCounts.set(channelId, subscriberCount);
            }

            return {
              subscriptions: newSubscriptions,
              subscriberCounts: newCounts,
              isLoading: false,
            };
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to subscribe",
            isLoading: false,
          });
          throw error;
        }
      },

      unsubscribe: async (channelId: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await fetch("/api/subscriptions/unsubscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ channelId }),
          });

          if (!response.ok) {
            throw new Error("Failed to unsubscribe");
          }

          const { subscriberCount } = await response.json();

          set((state) => {
            const newSubscriptions = new Set(state.subscriptions);
            newSubscriptions.delete(channelId);
            
            const newCounts = new Map(state.subscriberCounts);
            if (subscriberCount !== undefined) {
              newCounts.set(channelId, subscriberCount);
            }

            return {
              subscriptions: newSubscriptions,
              subscriberCounts: newCounts,
              isLoading: false,
            };
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to unsubscribe",
            isLoading: false,
          });
          throw error;
        }
      },

      isSubscribed: (channelId: string) => {
        return get().subscriptions.has(channelId);
      },

      getSubscriberCount: (channelId: string, defaultCount: string) => {
        const count = get().subscriberCounts.get(channelId);
        if (count !== undefined) {
          return count.toString();
        }
        return defaultCount;
      },

      setSubscriberCount: (channelId: string, count: number) => {
        set((state) => {
          const newCounts = new Map(state.subscriberCounts);
          newCounts.set(channelId, count);
          return { subscriberCounts: newCounts };
        });
      },

      loadSubscriptions: async () => {
        try {
          set({ isLoading: true, error: null });

          const response = await fetch("/api/subscriptions");

          if (!response.ok) {
            throw new Error("Failed to load subscriptions");
          }

          const { subscriptions } = await response.json();

          set({
            subscriptions: new Set(subscriptions),
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to load subscriptions",
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "subscription-storage",
      partialize: (state) => ({
        subscriptions: Array.from(state.subscriptions),
        subscriberCounts: Array.from(state.subscriberCounts.entries()),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert arrays back to Set and Map after rehydration
          state.subscriptions = new Set(state.subscriptions as unknown as string[]);
          state.subscriberCounts = new Map(
            state.subscriberCounts as unknown as [string, number][]
          );
        }
      },
    }
  )
);

