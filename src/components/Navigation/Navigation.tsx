"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { Search, Menu, Video } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";
import { SearchHistoryDropdown } from "@/components/SearchHistoryDropdown";
import { useSearchStore } from "@/store/search-store";

interface NavigationProps {
  onSearch?: (query: string) => void;
}

export function Navigation({ onSearch }: NavigationProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const { addToHistory } = useSearchStore();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    addToHistory(trimmedQuery);
    setShowHistory(false);

    if (onSearch) {
      onSearch(trimmedQuery);
    } else {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const handleHistorySelect = (query: string) => {
    setSearchQuery(query);
    performSearch(query);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center gap-4 px-4 py-3 max-w-[2000px] mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          <Video className="w-8 h-8 text-red-600" aria-hidden="true" />
          <h1 className="text-xl font-semibold hidden sm:block">VideoTube</h1>
        </Link>

        <div
          ref={searchContainerRef}
          className="flex-1 max-w-2xl mx-auto relative"
        >
          <form onSubmit={handleSubmit} role="search">
            <div className="flex items-center">
              <div className="flex-1 relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowHistory(true)}
                  placeholder="Search videos..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  aria-label="Search videos"
                  aria-autocomplete="list"
                  aria-controls="search-history"
                />
              </div>
              <button
                type="submit"
                className="cursor-pointer px-6 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-600" aria-hidden="true" />
              </button>
            </div>
          </form>

          <SearchHistoryDropdown
            isVisible={showHistory}
            onSelectQuery={handleHistorySelect}
          />
        </div>

        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : session ? (
            <UserMenu session={session} />
          ) : (
            <button
              type="button"
              onClick={() => signIn("google")}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-full hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
