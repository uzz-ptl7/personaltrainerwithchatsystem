import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface NotificationRequest {
  recipientId: string;
  senderName: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientId, senderName, message }: NotificationRequest = await req.json();

    // Get recipient's push subscriptions
    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', recipientId);

    // Get recipient profile for email fallback
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('user_id', recipientId)
      .single();

    let notificationSent = false;

    // Try push notifications first
    if (subscriptions && subscriptions.length > 0) {
      const pushPromises = subscriptions.map(async (sub) => {
        try {
          const response = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
              'Authorization': `key=${Deno.env.get('FCM_SERVER_KEY')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: sub.subscription.keys?.auth || sub.subscription.endpoint,
              notification: {
                title: `New message from ${senderName}`,
                body: message,
                icon: '/favicon.ico',
                click_action: '/'
              }
            })
          });
          
          if (response.ok) {
            notificationSent = true;
          }
        } catch (error) {
          console.error('Push notification failed:', error);
        }
      });

      await Promise.all(pushPromises);
    }

    // Fallback to email if push notifications failed or user has no subscriptions
    if (!notificationSent && profile?.email) {
      try {
        await supabase.functions.invoke('send-notification-email', {
          body: {
            to: profile.email,
            recipientName: profile.full_name,
            senderName,
            message
          }
        });
        notificationSent = true;
      } catch (error) {
        console.error('Email notification failed:', error);
      }
    }

    return new Response(
      JSON.stringify({ success: notificationSent }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error sending notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);