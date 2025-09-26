import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { to, recipientName, senderName, message } = JSON.parse(event.body);

    if (!to || !senderName || !message) {
      return { statusCode: 400, headers, body: "Missing required fields" };
    }

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
          <p><a href="/" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Message</a></p>
          <p>Best regards,<br>Your Coach App Team</p>
        </div>
      `,
    });

    return { statusCode: 200, headers, body: JSON.stringify(emailResponse) };
  } catch (err: any) {
    console.error("Send-email error:", err);
    return { statusCode: 500, headers, body: err.message };
  }
}
