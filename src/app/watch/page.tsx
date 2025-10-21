"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Video, Home, Search } from "lucide-react";

export default function WatchIndexPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6">
            <Video className="w-20 h-20 text-gray-300 mx-auto" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            No Video Selected
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Please select a video to watch or search for content
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/"
              className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Home className="w-5 h-5" aria-hidden="true" />
              Go to Home
            </Link>

            <button
              type="button"
              onClick={() => {
                const searchInput = document.querySelector(
                  'input[type="search"]'
                ) as HTMLInputElement;
                if (searchInput) {
                  searchInput.focus();
                } else {
                  router.push("/");
                }
              }}
              className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
              Search Videos
            </button>
          </div>

          <div className="mt-12 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">Tip:</span> Video URLs
              should include an ID, like{" "}
              <code className="px-2 py-1 bg-white rounded text-xs font-mono border border-gray-200">
                /watch/VIDEO_ID
              </code>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
