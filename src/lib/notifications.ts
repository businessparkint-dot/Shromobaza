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

    const response = await fetch(
      "/api/notifications/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

    if (!response.ok) {
      const result = await response
        .json()
        .catch(() => null);

      console.error(
        "Notification API error:",
        result?.error ||
          `HTTP ${response.status}`
      );

      return false;
    }

    const result = await response.json();

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