"use client";

import { useState } from "react";
import { Search, Menu, Video } from "lucide-react";

interface NavigationProps {
  onSearch: (query: string) => void;
}

export function Navigation({ onSearch }: NavigationProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center gap-4 px-4 py-3 max-w-[2000px] mx-auto">
        <button
          type="button"
          aria-label="Menu"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          <Video className="w-8 h-8 text-red-600" aria-hidden="true" />
          <h1 className="text-xl font-semibold hidden sm:block">VideoTube</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 max-w-2xl mx-auto"
          role="search"
        >
          <div className="flex items-center">
            <div className="flex-1 relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                aria-label="Search videos"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-600" aria-hidden="true" />
            </button>
          </div>
        </form>

        <div className="hidden md:block w-24" aria-hidden="true" />
      </div>
    </nav>
  );
}
