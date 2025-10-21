"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function WatchError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Watch page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6">
            <AlertTriangle className="w-20 h-20 text-red-500 mx-auto" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Something Went Wrong
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            We encountered an error while loading this video
          </p>

          {error.message && (
            <div className="mb-8 p-4 bg-red-50 rounded-lg border border-red-100 max-w-md">
              <p className="text-sm text-red-800 font-mono break-words">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={reset}
              className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <RefreshCw className="w-5 h-5" aria-hidden="true" />
              Try Again
            </button>

            <Link
              href="/"
              className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              <Home className="w-5 h-5" aria-hidden="true" />
              Back to Home
            </Link>
          </div>

          {error.digest && (
            <div className="mt-8">
              <p className="text-xs text-gray-500">
                Error ID: <code className="font-mono">{error.digest}</code>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
