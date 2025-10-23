import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { userSubscriptions } from "@/lib/subscriptions-store";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { channelId } = await request.json();

    if (!channelId) {
      return NextResponse.json(
        { error: "Channel ID is required" },
        { status: 400 }
      );
    }

    const userEmail = session.user.email;
    const subscriptions = userSubscriptions.get(userEmail);

    if (subscriptions) {
      subscriptions.delete(channelId);
    }

    return NextResponse.json({
      success: true,
      channelId,
    });
  } catch (error) {
    console.error("Error unsubscribing:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}

