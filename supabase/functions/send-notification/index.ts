// server.ts
import express, { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import * as admin from "firebase-admin";
import jwt from "jsonwebtoken";
import fetch from "node-fetch"; // Node 18+ has fetch globally

// Load environment variables
import "dotenv/config";

const app = express();
app.use(express.json());

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// -------------------- Supabase --------------------
const supabase = createClient(
  process.env.VITE_SUPABASE_URL ?? "",
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? ""
);

// -------------------- Firebase --------------------
const serviceAccount: admin.ServiceAccount = {
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  privateKey: process.env.VITE_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  clientEmail: process.env.VITE_FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// -------------------- FCM Access Token --------------------
async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.clientEmail,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  if (!serviceAccount.privateKey) {
    throw new Error("Firebase private key is not defined in environment variables.");
  }
  const token = jwt.sign(payload, serviceAccount.privateKey, { algorithm: "RS256" });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${token}`,
  });

  const data = await res.json() as { access_token: string };
  return data.access_token;
}

// -------------------- Routes --------------------
app.options("*", (_: Request, res: Response) => res.set(corsHeaders).send());

app.post("/send-push", async (req: Request, res: Response) => {
  try {
    const { recipientId, senderName, message } = req.body;

    const { data: subscriptions } = await supabase
      .from("push_subscriptions")
      .select("subscription")
      .eq("user_id", recipientId);

    let notificationSent = false;

    if (subscriptions?.length) {
      const accessToken = await getAccessToken();

      await Promise.all(
        subscriptions.map(async (sub) => {
          try {
            const fcmToken = sub.subscription?.endpoint || sub.subscription?.keys?.auth;
            const url = `https://fcm.googleapis.com/v1/projects/${serviceAccount.projectId}/messages:send`;

            const body = {
              message: {
                token: fcmToken,
                notification: { title: `New message from ${senderName}`, body: message },
                android: { notification: { click_action: "OPEN_APP" } },
                webpush: { notification: { click_action: "/" } },
              },
            };

            const response = await fetch(url, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            });

            if (response.ok) notificationSent = true;
            else console.error("FCM error:", await response.text());
          } catch (err) {
            console.error("Push failed:", err);
          }
        })
      );
    }

    res.set(corsHeaders).status(200).json({ success: notificationSent });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- Server --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
