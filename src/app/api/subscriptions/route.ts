import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { userSubscriptions } from "@/lib/subscriptions-store";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    const subscriptions = userSubscriptions.get(userEmail) || new Set();

    return NextResponse.json({
      subscriptions: Array.from(subscriptions),
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

