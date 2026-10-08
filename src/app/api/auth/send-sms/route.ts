
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const rawSecret = process.env.SEND_SMS_HOOK_SECRET;

    if (!rawSecret) {
      console.error("SEND_SMS_HOOK_SECRET is missing");

      return NextResponse.json(
        { error: "SMS hook is not configured." },
        { status: 500 },
      );
    }

    const hookSecret = rawSecret
      .replace(/^v1,whsec_/, "")
      .trim();

    if (!/^[A-Za-z0-9+/=_-]+$/.test(hookSecret)) {
      console.error("SEND_SMS_HOOK_SECRET contains invalid characters");

      return NextResponse.json(
        { error: "Invalid SMS hook secret format." },
        { status: 500 },
      );
    }

    const payload = await request.text();

    const headers = {
      "webhook-id": request.headers.get("webhook-id") ?? "",
      "webhook-signature":
        request.headers.get("webhook-signature") ?? "",
      "webhook-timestamp":
        request.headers.get("webhook-timestamp") ?? "",
    };

    let wh: Webhook;

    try {
      wh = new Webhook(hookSecret);
    } catch (error) {
      console.error("SMS Webhook constructor error:", error);

      return NextResponse.json(
        { error: "SMS webhook configuration error." },
        { status: 500 },
      );
    }

    let verified: {
      user?: {
        phone?: string;
      };
      sms?: {
        otp?: string;
      };
    };

    try {
      verified = wh.verify(payload, headers) as typeof verified;
    } catch (error) {
      console.error("SMS Webhook verification error:", error);

      return NextResponse.json(
        { error: "SMS webhook verification failed." },
        { status: 500 },
      );
    }

    const { user, sms } = verified;

    const phone = user?.phone;
    const otp = sms?.otp;

    if (!phone || !otp) {
      console.error("Phone number or OTP is missing");

      return NextResponse.json(
        { error: "Phone number or OTP is missing." },
        { status: 400 },
      );
    }

    const zendSmsApiKey = process.env.ZENDSMS_API_KEY;
    const zendSmsSenderId = process.env.ZENDSMS_SENDER_ID;

    if (!zendSmsApiKey || !zendSmsSenderId) {
      console.error("ZendSMS environment variables are missing");

      return NextResponse.json(
        { error: "SMS provider is not configured." },
        { status: 500 },
      );
    }

    const response = await fetch(
      "https://api.zendsms.com/api/v1/send-sms",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${zendSmsApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: phone.replace("+", ""),
          sender_id: zendSmsSenderId,
          message: `Your Shromobazar verification code is ${otp}. Do not share this code.`,
          client_ref: `shromobazar-${Date.now()}`,
        }),
      },
    );

    const result = await response.text();

    if (!response.ok) {
      console.error("ZendSMS error:", result);

      return NextResponse.json(
        { error: "SMS provider rejected the request." },
        { status: 502 },
      );
    }

    console.log("ZendSMS response:", result);

    return NextResponse.json({});
  } catch (error) {
    console.error("Send SMS hook error:", error);

    return NextResponse.json(
      { error: "Unable to send SMS." },
      { status: 500 },
    );
  }
}
