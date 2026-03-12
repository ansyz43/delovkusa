// Supabase Edge Function: send-sms
// Эту функцию нужно создать в Supabase Dashboard → Edge Functions
// Она принимает запросы от Supabase Auth Hook и отправляет SMS через sms.ru

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SMS_RU_API_ID = Deno.env.get("SMS_RU_API_ID") || "";

interface AuthHookPayload {
  user: {
    phone: string;
  };
  sms: {
    otp: string;
  };
}

serve(async (req) => {
  try {
    // Проверяем метод
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
      });
    }

    const payload: AuthHookPayload = await req.json();
    const phone = payload.user.phone;
    const otp = payload.sms.otp;

    if (!phone || !otp) {
      return new Response(
        JSON.stringify({ error: "Missing phone or OTP" }),
        { status: 400 }
      );
    }

    // Формируем сообщение
    const message = `Код подтверждения: ${otp}. Дело Вкуса`;

    // Отправляем SMS через sms.ru
    const smsUrl = `https://sms.ru/sms/send?api_id=${SMS_RU_API_ID}&to=${encodeURIComponent(phone)}&msg=${encodeURIComponent(message)}&json=1`;

    const smsResponse = await fetch(smsUrl);
    const smsResult = await smsResponse.json();

    console.log("SMS.RU response:", JSON.stringify(smsResult));

    // Проверяем результат
    if (smsResult.status === "OK") {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      console.error("SMS.RU error:", smsResult);
      return new Response(
        JSON.stringify({ error: "SMS sending failed", details: smsResult }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
