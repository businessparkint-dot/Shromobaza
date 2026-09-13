import { createClient } from "@supabase/supabase-js";

export type ServerNotificationType =
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

export type CreateServerNotificationInput = {
  userId: string;
  type?: ServerNotificationType;
  title: string;
  message?: string | null;
  href?: string | null;
  metadata?: Record<string, unknown>;
};

const NOTIFICATION_TYPES: readonly ServerNotificationType[] = [
  "job",
  "marketplace",
  "business",
  "social",
  "chat",
  "wallet",
  "review",
  "system",
  "promotion",
  "support",
  "education",
  "health",
  "sports",
  "entertainment",
  "event",
];

function isValidUuid(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function isValidNotificationType(
  value: unknown
): value is ServerNotificationType {
  return (
    typeof value === "string" &&
    NOTIFICATION_TYPES.includes(
      value as ServerNotificationType
    )
  );
}

function getAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase server notification configuration is missing."
    );
  }

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Create one notification for a specific user.
 *
 * IMPORTANT:
 * This function is SERVER-ONLY.
 * Never import it into a client component.
 */
export async function createServerNotification(
  input: CreateServerNotificationInput
): Promise<boolean> {
  try {
    if (!isValidUuid(input.userId)) {
      console.error(
        "Server notification skipped: invalid userId."
      );

      return false;
    }

    if (!input.title?.trim()) {
      console.error(
        "Server notification skipped: title is missing."
      );

      return false;
    }

    const type = input.type || "system";

    if (!isValidNotificationType(type)) {
      console.error(
        "Server notification skipped: invalid notification type."
      );

      return false;
    }

    const title = input.title.trim();

    const message =
      typeof input.message === "string"
        ? input.message.trim() || null
        : null;

    const href =
      typeof input.href === "string"
        ? input.href.trim() || null
        : null;

    const metadata =
      input.metadata &&
      typeof input.metadata === "object" &&
      !Array.isArray(input.metadata)
        ? input.metadata
        : {};

    const supabase = getAdminClient();

    const { error } = await supabase
      .from("notifications")
      .insert({
        user_id: input.userId,
        type,
        title,
        message,
        href,
        metadata,
        read: false,
      });

    if (error) {
      console.error(
        "SERVER NOTIFICATION CREATE ERROR:",
        error
      );

      return false;
    }

    return true;
  } catch (error) {
    console.error(
      "SERVER NOTIFICATION ERROR:",
      error
    );

    return false;
  }
}

/**
 * Create multiple notifications.
 *
 * Useful when one event needs to notify
 * more than one user.
 */
export async function createServerNotifications(
  notifications: CreateServerNotificationInput[]
): Promise<boolean> {
  if (!notifications.length) {
    return true;
  }

  const results = await Promise.all(
    notifications.map((notification) =>
      createServerNotification(notification)
    )
  );

  return results.every(Boolean);
}
