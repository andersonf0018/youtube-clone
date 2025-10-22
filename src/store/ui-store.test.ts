import { describe, it, expect, beforeEach } from "vitest";
import { useUiStore } from "./ui-store";

describe("useUiStore", () => {
  beforeEach(() => {
    const state = useUiStore.getState();
    state.setSidebarOpen(true);
    state.setSidebarCollapsed(false);
    state.setSearchFocused(false);
  });

  it("should have correct initial state", () => {
    const state = useUiStore.getState();

    expect(state.isSidebarOpen).toBe(true);
    expect(state.isSidebarCollapsed).toBe(false);
    expect(state.isSearchFocused).toBe(false);
  });

  it("should toggle sidebar from open to closed", () => {
    const { toggleSidebar } = useUiStore.getState();

    expect(useUiStore.getState().isSidebarOpen).toBe(true);

    toggleSidebar();

    expect(useUiStore.getState().isSidebarOpen).toBe(false);
  });

  it("should toggle sidebar from closed to open", () => {
    const { setSidebarOpen, toggleSidebar } = useUiStore.getState();

    setSidebarOpen(false);
    expect(useUiStore.getState().isSidebarOpen).toBe(false);

    toggleSidebar();

    expect(useUiStore.getState().isSidebarOpen).toBe(true);
  });

  it("should toggle sidebar multiple times", () => {
    const { toggleSidebar } = useUiStore.getState();

    expect(useUiStore.getState().isSidebarOpen).toBe(true);

    toggleSidebar();
    expect(useUiStore.getState().isSidebarOpen).toBe(false);

    toggleSidebar();
    expect(useUiStore.getState().isSidebarOpen).toBe(true);

    toggleSidebar();
    expect(useUiStore.getState().isSidebarOpen).toBe(false);
  });

  it("should set sidebar open to true", () => {
    const { setSidebarOpen } = useUiStore.getState();

    setSidebarOpen(false);
    expect(useUiStore.getState().isSidebarOpen).toBe(false);

    setSidebarOpen(true);
    expect(useUiStore.getState().isSidebarOpen).toBe(true);
  });

  it("should set sidebar open to false", () => {
    const { setSidebarOpen } = useUiStore.getState();

    setSidebarOpen(true);
    expect(useUiStore.getState().isSidebarOpen).toBe(true);

    setSidebarOpen(false);
    expect(useUiStore.getState().isSidebarOpen).toBe(false);
  });

  it("should set sidebar collapsed to true", () => {
    const { setSidebarCollapsed } = useUiStore.getState();

    expect(useUiStore.getState().isSidebarCollapsed).toBe(false);

    setSidebarCollapsed(true);
    expect(useUiStore.getState().isSidebarCollapsed).toBe(true);
  });

  it("should set sidebar collapsed to false", () => {
    const { setSidebarCollapsed } = useUiStore.getState();

    setSidebarCollapsed(true);
    expect(useUiStore.getState().isSidebarCollapsed).toBe(true);

    setSidebarCollapsed(false);
    expect(useUiStore.getState().isSidebarCollapsed).toBe(false);
  });

  it("should set search focused to true", () => {
    const { setSearchFocused } = useUiStore.getState();

    expect(useUiStore.getState().isSearchFocused).toBe(false);

    setSearchFocused(true);
    expect(useUiStore.getState().isSearchFocused).toBe(true);
  });

  it("should set search focused to false", () => {
    const { setSearchFocused } = useUiStore.getState();

    setSearchFocused(true);
    expect(useUiStore.getState().isSearchFocused).toBe(true);

    setSearchFocused(false);
    expect(useUiStore.getState().isSearchFocused).toBe(false);
  });

  it("should handle independent state changes", () => {
    const { setSidebarOpen, setSidebarCollapsed, setSearchFocused } =
      useUiStore.getState();

    setSidebarOpen(false);
    setSidebarCollapsed(true);
    setSearchFocused(true);

    const state = useUiStore.getState();
    expect(state.isSidebarOpen).toBe(false);
    expect(state.isSidebarCollapsed).toBe(true);
    expect(state.isSearchFocused).toBe(true);
  });

  it("should not affect other state when toggling sidebar", () => {
    const { toggleSidebar, setSidebarCollapsed, setSearchFocused } =
      useUiStore.getState();

    setSidebarCollapsed(true);
    setSearchFocused(true);

    toggleSidebar();

    const state = useUiStore.getState();
    expect(state.isSidebarCollapsed).toBe(true);
    expect(state.isSearchFocused).toBe(true);
  });

  it("should not affect other state when setting sidebar open", () => {
    const { setSidebarOpen, setSidebarCollapsed, setSearchFocused } =
      useUiStore.getState();

    setSidebarCollapsed(true);
    setSearchFocused(true);

    setSidebarOpen(false);

    const state = useUiStore.getState();
    expect(state.isSidebarCollapsed).toBe(true);
    expect(state.isSearchFocused).toBe(true);
  });

  it("should not affect other state when setting sidebar collapsed", () => {
    const { setSidebarOpen, setSidebarCollapsed, setSearchFocused } =
      useUiStore.getState();

    setSidebarOpen(false);
    setSearchFocused(true);

    setSidebarCollapsed(true);

    const state = useUiStore.getState();
    expect(state.isSidebarOpen).toBe(false);
    expect(state.isSearchFocused).toBe(true);
  });

  it("should not affect other state when setting search focused", () => {
    const { setSidebarOpen, setSidebarCollapsed, setSearchFocused } =
      useUiStore.getState();

    setSidebarOpen(false);
    setSidebarCollapsed(true);

    setSearchFocused(true);

    const state = useUiStore.getState();
    expect(state.isSidebarOpen).toBe(false);
    expect(state.isSidebarCollapsed).toBe(true);
  });

  it("should allow setting same value multiple times", () => {
    const { setSidebarOpen } = useUiStore.getState();

    setSidebarOpen(true);
    expect(useUiStore.getState().isSidebarOpen).toBe(true);

    setSidebarOpen(true);
    expect(useUiStore.getState().isSidebarOpen).toBe(true);

    setSidebarOpen(true);
    expect(useUiStore.getState().isSidebarOpen).toBe(true);
  });
});
