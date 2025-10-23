"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useSubscriptionStore } from "@/store/subscription-store";
import { useFocusTrap } from "@/hooks/use-focus-trap";

interface SubscribeButtonProps {
  channelId: string;
  channelTitle: string;
  variant?: "default" | "compact";
  className?: string;
}

export function SubscribeButton({
  channelId,
  channelTitle,
  variant = "default",
  className = "",
}: SubscribeButtonProps) {
  const { data: session } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useFocusTrap(showLoginModal);

  const {
    subscribe,
    unsubscribe,
    isSubscribed: checkSubscribed,
  } = useSubscriptionStore();

  const isSubscribed = checkSubscribed(channelId);

  const handleSubscribeClick = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (!session) {
      setShowLoginModal(true);
      return;
    }

    setIsLoading(true);
    try {
      if (isSubscribed) {
        await unsubscribe(channelId);
      } else {
        await subscribe(channelId);
      }
    } catch (error) {
      console.error("Subscribe error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(false);
    signIn("google");
  };

  const baseClasses =
    "rounded-full font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed";

  const variantClasses = {
    default: "px-6 py-2 min-w-[120px]",
    compact: "px-4 py-2",
  };

  const stateClasses = isSubscribed
    ? "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300"
    : "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500";

  return (
    <>
      <button
        type="button"
        onClick={handleSubscribeClick}
        disabled={isLoading}
        className={`${baseClasses} ${variantClasses[variant]} ${stateClasses} ${className}`}
        aria-label={
          isSubscribed
            ? `Unsubscribe from ${channelTitle}`
            : `Subscribe to ${channelTitle}`
        }
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{isSubscribed ? "Subscribed" : "Subscribe"}</span>
          </span>
        ) : isSubscribed ? (
          "Subscribed"
        ) : (
          "Subscribe"
        )}
      </button>

      {showLoginModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowLoginModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-modal-title"
        >
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="login-modal-title"
              className="text-xl font-semibold text-gray-900 mb-2"
            >
              Sign in required
            </h2>
            <p className="text-gray-600 mb-6">
              You need to be signed in to subscribe to channels. Sign in with
              your Google account to continue.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleLoginClick}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                data-close-modal="true"
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

