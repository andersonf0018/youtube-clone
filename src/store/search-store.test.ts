import { describe, it, expect, beforeEach } from "vitest";
import { useSearchStore } from "./search-store";

describe("useSearchStore", () => {
  beforeEach(() => {
    const { clearHistory, setCurrentQuery } = useSearchStore.getState();
    clearHistory();
    setCurrentQuery("");
  });

  it("should have correct initial state", () => {
    const state = useSearchStore.getState();

    expect(state.currentQuery).toBe("");
    expect(state.searchHistory).toEqual([]);
  });

  it("should set current query", () => {
    const { setCurrentQuery } = useSearchStore.getState();

    setCurrentQuery("react tutorial");

    expect(useSearchStore.getState().currentQuery).toBe("react tutorial");
  });

  it("should add query to history", () => {
    const { addToHistory } = useSearchStore.getState();

    addToHistory("react tutorial");

    const state = useSearchStore.getState();
    expect(state.searchHistory).toHaveLength(1);
    expect(state.searchHistory[0].query).toBe("react tutorial");
    expect(state.searchHistory[0].timestamp).toBeTypeOf("number");
  });

  it("should not add empty or whitespace-only queries to history", () => {
    const { addToHistory } = useSearchStore.getState();

    addToHistory("");
    addToHistory("   ");

    expect(useSearchStore.getState().searchHistory).toHaveLength(0);
  });

  it("should trim queries before adding to history", () => {
    const { addToHistory } = useSearchStore.getState();

    addToHistory("  react tutorial  ");

    const state = useSearchStore.getState();
    expect(state.searchHistory[0].query).toBe("react tutorial");
  });

  it("should move duplicate query to top of history", () => {
    const { addToHistory } = useSearchStore.getState();

    addToHistory("react");
    addToHistory("vue");
    addToHistory("angular");
    addToHistory("react");

    const state = useSearchStore.getState();
    expect(state.searchHistory).toHaveLength(3);
    expect(state.searchHistory[0].query).toBe("react");
    expect(state.searchHistory[1].query).toBe("angular");
    expect(state.searchHistory[2].query).toBe("vue");
  });

  it("should limit history to 20 items", () => {
    const { addToHistory } = useSearchStore.getState();

    for (let i = 1; i <= 25; i++) {
      addToHistory(`query ${i}`);
    }

    const state = useSearchStore.getState();
    expect(state.searchHistory).toHaveLength(20);
    expect(state.searchHistory[0].query).toBe("query 25");
    expect(state.searchHistory[19].query).toBe("query 6");
  });

  it("should remove specific query from history", () => {
    const { addToHistory, removeFromHistory } = useSearchStore.getState();

    addToHistory("react");
    addToHistory("vue");
    addToHistory("angular");

    removeFromHistory("vue");

    const state = useSearchStore.getState();
    expect(state.searchHistory).toHaveLength(2);
    expect(state.searchHistory.some((item) => item.query === "vue")).toBe(false);
  });

  it("should clear all history", () => {
    const { addToHistory, clearHistory } = useSearchStore.getState();

    addToHistory("react");
    addToHistory("vue");
    addToHistory("angular");

    clearHistory();

    expect(useSearchStore.getState().searchHistory).toHaveLength(0);
  });
});
