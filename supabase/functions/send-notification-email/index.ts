import express from "express";
import { Resend } from "resend";

const app = express();
app.use(express.json());

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(process.env.RESEND_API_KEY);

app.options("*", (_, res) => res.set(corsHeaders).send());

app.post("/send-email", async (req, res) => {
  try {
    const { to, recipientName, senderName, message } = req.body;

    const emailResponse = await resend.emails.send({
      from: "Coach App <notifications@resend.dev>",
      to: [to],
      subject: `New message from ${senderName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Message from ${senderName}</h2>
          <p>Hi ${recipientName || "there"},</p>
          <p>You have received a new message:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p style="margin: 0; font-style: italic;">"${message}"</p>
          </div>
          <p>
            <a href="/" 
               style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View Message
            </a>
          </p>
          <p>Best regards,<br>Your Coach App Team</p>
        </div>
      `,
    });

    res.set(corsHeaders).status(200).json(emailResponse);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default app;
