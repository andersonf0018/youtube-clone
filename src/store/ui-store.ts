import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  isSearchFocused: boolean;

  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setSidebarCollapsed: (isCollapsed: boolean) => void;
  setSearchFocused: (isFocused: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      isSidebarCollapsed: false,
      isSearchFocused: false,

      toggleSidebar: () =>
        set((state) => ({
          isSidebarOpen: !state.isSidebarOpen,
        })),

      setSidebarOpen: (isOpen) =>
        set(() => ({
          isSidebarOpen: isOpen,
        })),

      setSidebarCollapsed: (isCollapsed) =>
        set(() => ({
          isSidebarCollapsed: isCollapsed,
        })),

      setSearchFocused: (isFocused) =>
        set(() => ({
          isSearchFocused: isFocused,
        })),
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({
        isSidebarCollapsed: state.isSidebarCollapsed,
      }),
    }
  )
);
