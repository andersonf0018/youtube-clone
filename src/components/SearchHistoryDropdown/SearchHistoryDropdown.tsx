"use client";

import { useSearchStore } from "@/store/search-store";
import { Clock, X } from "lucide-react";

interface SearchHistoryDropdownProps {
  onSelectQuery: (query: string) => void;
  isVisible: boolean;
}

export function SearchHistoryDropdown({
  onSelectQuery,
  isVisible,
}: SearchHistoryDropdownProps) {
  const { searchHistory, removeFromHistory, clearHistory } = useSearchStore();

  if (!isVisible || searchHistory.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">Search History</h3>
        <button
          type="button"
          onClick={clearHistory}
          className="text-xs text-blue-600 hover:text-blue-700 transition-colors cursor-pointer focus:outline-none focus:underline"
        >
          Clear all
        </button>
      </div>

      <ul role="listbox" aria-label="Search history">
        {searchHistory.map((item) => (
          <li key={`${item.query}-${item.timestamp}`} className="group">
            <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
              <Clock
                className="w-4 h-4 text-gray-400 flex-shrink-0"
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={() => onSelectQuery(item.query)}
                className="flex-1 text-left text-sm text-gray-700 hover:text-gray-900 transition-colors cursor-pointer focus:outline-none focus:underline"
              >
                {item.query}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromHistory(item.query);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all cursor-pointer focus:outline-none focus:opacity-100 focus:ring-2 focus:ring-gray-300"
                aria-label={`Remove ${item.query} from history`}
              >
                <X className="w-4 h-4 text-gray-500" aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
