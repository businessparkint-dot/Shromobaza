import { supabase } from "@/lib/client";

export type NotificationType =
  | "job"
  | "marketplace"
  | "business"
  | "social"
  | "chat"
  | "wallet"
  | "review"
  | "system"
  | "promotion"
  | "support"
  | "education"
  | "health"
  | "sports"
  | "entertainment"
  | "event";

export type CreateNotificationInput = {
  userId: string;
  type: NotificationType;
  title: string;
  message?: string | null;
  href?: string | null;
  metadata?: Record<string, unknown>;
};

export async function createNotification(
  input: CreateNotificationInput
): Promise<boolean> {
  try {
    if (!input.userId) {
      console.warn(
        "Notification skipped: userId is missing."
      );
      return false;
    }

    if (!input.title?.trim()) {
      console.warn(
        "Notification skipped: title is missing."
      );
      return false;
    }

    /*
     * Get the currently authenticated user's session.
     * The access token is required by the secure
     * /api/notifications/create endpoint.
     */
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error(
        "Notification session error:",
        sessionError
      );
      return false;
    }

    if (!session?.access_token) {
      console.warn(
        "Notification skipped: user is not authenticated."
      );
      return false;
    }

    /*
     * Security check on the client as an early guard.
     *
     * The server performs the authoritative check again.
     */
    if (session.user.id !== input.userId) {
      console.warn(
        "Notification skipped: userId does not match authenticated user."
      );
      return false;
    }

    const response = await fetch(
      "/api/notifications/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userId: input.userId,
          type: input.type,
          title: input.title.trim(),
          message:
            input.message?.trim() || null,
          href: input.href || null,
          metadata: input.metadata || {},
        }),
      }
    );

    const result = await response
      .json()
      .catch(() => null);

    if (!response.ok) {
      console.error(
        "Notification API error:",
        result?.error ||
          `HTTP ${response.status}`
      );

      return false;
    }

    return result?.success === true;
  } catch (error) {
    console.error(
      "Notification create error:",
      error
    );

    return false;
  }
}

export async function createNotifications(
  notifications: CreateNotificationInput[]
): Promise<boolean> {
  if (!notifications.length) {
    return true;
  }

  const results = await Promise.all(
    notifications.map((notification) =>
      createNotification(notification)
    )
  );

  return results.every(Boolean);
}
