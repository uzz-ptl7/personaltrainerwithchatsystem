import { createClient } from "@supabase/supabase-js";
import * as admin from "firebase-admin";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const serviceAccount: admin.ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

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
    const { recipientId, senderName, message } = JSON.parse(event.body);
    if (!recipientId || !message) {
      return { statusCode: 400, headers, body: "Missing recipientId or message" };
    }

    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("fcm_token")
      .eq("user_id", recipientId);

    if (error) throw error;
    if (!subscriptions?.length) {
      return { statusCode: 404, headers, body: "No subscription found" };
    }

    await Promise.all(
      subscriptions.map(sub =>
        admin.messaging().send({
          token: sub.fcm_token,
          notification: { title: `New message from ${senderName}`, body: message },
          android: { notification: { clickAction: "OPEN_APP" } },
          webpush: { notification: { click_action: "/" } },
        })
      )
    );

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err: any) {
    console.error("Send-push error:", err);
    return { statusCode: 500, headers, body: err.message };
  }
}
