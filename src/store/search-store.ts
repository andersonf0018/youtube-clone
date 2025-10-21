import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

interface SearchState {
  currentQuery: string;
  searchHistory: SearchHistoryItem[];
  setCurrentQuery: (query: string) => void;
  addToHistory: (query: string) => void;
  clearHistory: () => void;
  removeFromHistory: (query: string) => void;
}

const MAX_HISTORY_ITEMS = 20;

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      currentQuery: "",
      searchHistory: [],

      setCurrentQuery: (query) =>
        set(() => ({
          currentQuery: query,
        })),

      addToHistory: (query) =>
        set((state) => {
          const trimmedQuery = query.trim();
          if (!trimmedQuery) return state;

          const filtered = state.searchHistory.filter(
            (item) => item.query !== trimmedQuery
          );

          const newHistory = [
            { query: trimmedQuery, timestamp: Date.now() },
            ...filtered,
          ].slice(0, MAX_HISTORY_ITEMS);

          return { searchHistory: newHistory };
        }),

      clearHistory: () =>
        set(() => ({
          searchHistory: [],
        })),

      removeFromHistory: (query) =>
        set((state) => ({
          searchHistory: state.searchHistory.filter(
            (item) => item.query !== query
          ),
        })),
    }),
    {
      name: "search-storage",
      partialize: (state) => ({
        searchHistory: state.searchHistory,
      }),
    }
  )
);
