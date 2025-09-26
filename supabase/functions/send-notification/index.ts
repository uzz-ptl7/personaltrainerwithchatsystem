import express from "express";
import { createClient } from "@supabase/supabase-js";
import * as admin from "firebase-admin";
import "dotenv/config";

const app = express();
app.use(express.json());

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

const serviceAccount: admin.ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.options("*", (_, res) => res.set(corsHeaders).send());

app.post("/send-push", async (req, res) => {
  try {
    const { recipientId, senderName, message } = req.body;

    if (!recipientId || !message) {
      return res.status(400).json({ error: "Missing recipientId or message" });
    }

    // Get all FCM tokens for the recipient (supports multiple devices)
    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("fcm_token")
      .eq("user_id", recipientId);

    if (error) throw error;
    if (!subscriptions?.length) {
      return res.status(404).json({ error: "No subscription found" });
    }

    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await admin.messaging().send({
            token: sub.fcm_token,
            notification: {
              title: `New message from ${senderName}`,
              body: message,
            },
            android: { notification: { clickAction: "OPEN_APP" } },
            webpush: { notification: { click_action: "/" } },
          });
        } catch (err) {
          console.error("Push failed for token", sub.fcm_token, err);
        }
      })
    );

    res.set(corsHeaders).status(200).json({ success: true });
  } catch (err: any) {
    console.error("Send-push error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default app;
