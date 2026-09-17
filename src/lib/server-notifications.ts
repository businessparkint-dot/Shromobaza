// src/lib/server-notifications.ts
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
  message?: string;
  href?: string;
  metadata?: Record<string, unknown>;
};

const NOTIFICATION_TYPES: ServerNotificationType[] = [
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

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Supabase server environment is not configured.");
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function createServerNotification(
  input: CreateServerNotificationInput
) {
  if (!isUuid(input.userId)) {
    return { success: false, error: "Invalid userId" };
  }

  const title = input.title?.trim();

  if (!title) {
    return { success: false, error: "Notification title is required" };
  }

  const type = input.type ?? "system";

  if (!NOTIFICATION_TYPES.includes(type)) {
    return { success: false, error: "Invalid notification type" };
  }

  const supabase = getAdminClient();

  const { error } = await supabase.from("notifications").insert({
    user_id: input.userId,
    type,
    title: title.slice(0, 200),
    message: input.message?.trim().slice(0, 1000) || null,
    href: input.href?.trim().slice(0, 500) || null,
    metadata: input.metadata ?? {},
    read: false,
  });

  if (error) {
    console.error("createServerNotification:", error);
    return {
      success: false,
      error: error.message,
    };
  }

  return { success: true };
}

export async function createServerNotifications(
  inputs: CreateServerNotificationInput[]
) {
  return Promise.all(
    inputs.map((input) => createServerNotification(input))
  );
}