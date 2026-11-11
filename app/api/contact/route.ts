import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ContactFormSchema } from "@/lib/support/schema";
import { checkRateLimit } from "@/lib/support/ratelimit";
import { verifyTurnstileToken } from "@/lib/support/turnstile";
import { deliverContactMessage } from "@/lib/support/deliver";

const MAX_BODY_BYTES = 16 * 1024; // 16 KB

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();

  // 1. Check Content-Length size limit (<= 16 KB)
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Payload too large. Max allowed size is 16 KB." },
      { status: 413 }
    );
  }

  let bodyText: string;
  try {
    bodyText = await req.text();
    if (bodyText.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "Payload too large." },
        { status: 413 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  let rawJson: unknown;
  try {
    rawJson = JSON.parse(bodyText);
  } catch {
    return NextResponse.json({ error: "Malformed JSON." }, { status: 400 });
  }

  // 2. Honeypot check: If honeypot is filled, return 200 OK immediately without sending
  const jsonRecord = rawJson as Record<string, unknown>;
  if (jsonRecord.honeypot && String(jsonRecord.honeypot).trim().length > 0) {
    console.log(`🤖 Bot trap triggered for request ${requestId}. Silently dropped.`);
    return NextResponse.json({ ok: true, requestId });
  }

  // 3. Rate limiting (IP & email)
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const rateCheck = await checkRateLimit(`contact:${ip}`, 5, 3600);
  if (!rateCheck.success) {
    return NextResponse.json(
      {
        error: "Too many contact requests. Please wait before submitting again.",
        fallbackEmail: "support@connectpi.in",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.max(1, rateCheck.reset - Math.floor(Date.now() / 1000))),
        },
      }
    );
  }

  // 4. Validate schema with Zod
  const validation = ContactFormSchema.safeParse(rawJson);
  if (!validation.success) {
    return NextResponse.json(
      {
        error: "Validation error",
        issues: validation.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const data = validation.data;

  // 5. Verify Turnstile Anti-Spam
  const turnstileCheck = await verifyTurnstileToken(data.turnstileToken, ip);
  if (!turnstileCheck.success) {
    return NextResponse.json(
      { error: turnstileCheck.error || "Security verification failed." },
      { status: 403 }
    );
  }

  // 6. Deliver message via Resend
  const delivery = await deliverContactMessage(data, requestId);
  if (!delivery.success) {
    return NextResponse.json(
      {
        error:
          "Our email delivery provider is temporarily unavailable. Please email us directly.",
        fallbackEmail: "support@connectpi.in",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    requestId,
    message: "Thank you for contacting us. Our team will review your inquiry shortly.",
  });
}
