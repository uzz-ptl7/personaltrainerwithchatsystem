import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function handler(event: any) {
  const headers = {
    "Access-Control-Allow-Origin": "https://ptchatsystem.netlify.app",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: "Method Not Allowed" };
  }

  try {
    const { userId, fcmToken } = JSON.parse(event.body);

    if (!userId || !fcmToken) {
      return { statusCode: 400, headers, body: "Missing userId or fcmToken" };
    }

    const { error } = await supabase
      .from("push_subscriptions")
      .upsert(
        { user_id: userId, fcm_token: fcmToken },
        { onConflict: "fcm_token" }
      );

    if (error) throw error;

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err: any) {
    console.error("Save-push error:", err);
    return { statusCode: 500, headers, body: err.message };
  }
}
