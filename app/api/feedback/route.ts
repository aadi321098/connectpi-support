import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/support/ratelimit";

const FeedbackSchema = z.object({
  path: z.string().min(1).max(200),
  helpful: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Rate limit: max 30 feedbacks per hour per IP
    const rateCheck = await checkRateLimit(`feedback:${ip}`, 30, 3600);
    if (!rateCheck.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const result = FeedbackSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // In production, log or forward to analytics
    console.log(
      `📊 [FEEDBACK] Path: ${result.data.path} | Helpful: ${result.data.helpful}`
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
