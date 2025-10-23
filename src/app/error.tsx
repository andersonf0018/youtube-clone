"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { errorMonitoring } from "@/lib/error-monitoring";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    errorMonitoring.logError(error, {
      component: "GlobalErrorBoundary",
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6">
            <AlertCircle className="w-24 h-24 text-red-500 mx-auto" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Oops! Something Went Wrong
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            An unexpected error occurred. Please try again or return to the
            homepage.
          </p>

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

          {process.env.NODE_ENV === "development" && error.message && (
            <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-100 max-w-2xl w-full text-left">
              <p className="text-xs font-semibold text-red-900 mb-2">
                Development Error Details:
              </p>
              <pre className="text-xs text-red-800 font-mono whitespace-pre-wrap break-words">
                {error.message}
              </pre>
              {error.stack && (
                <details className="mt-2">
                  <summary className="text-xs font-semibold text-red-900 cursor-pointer hover:text-red-700">
                    Stack Trace
                  </summary>
                  <pre className="mt-2 text-xs text-red-700 font-mono whitespace-pre-wrap break-words">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
