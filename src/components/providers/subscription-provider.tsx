"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSubscriptionStore } from "@/store/subscription-store";

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const { loadSubscriptions } = useSubscriptionStore();

  useEffect(() => {
    if (status === "authenticated" && session) {
      loadSubscriptions();
    }
  }, [status, session, loadSubscriptions]);

  return <>{children}</>;
}

