import express from "express";
import { createClient } from "@supabase/supabase-js";

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

app.options("*", (_, res) => res.set(corsHeaders).send());

app.post("/save-subscription", async (req, res) => {
  try {
    const { userId, fcmToken } = req.body;

    if (!userId || !fcmToken) {
      return res.status(400).json({ error: "Missing userId or fcmToken" });
    }

    // Upsert ensures multiple devices for the same user
    const { error } = await supabase.from("push_subscriptions").upsert(
      {
        user_id: userId,
        fcm_token: fcmToken,
      },
      { onConflict: "fcm_token" }
    );

    if (error) throw error;

    res.set(corsHeaders).status(200).json({ success: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default app;
