export async function verifyTurnstileToken(
  token?: string,
  ip?: string
): Promise<{ success: boolean; error?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // In development / testing or without secret key, bypass verification
  if (!secretKey) {
    if (process.env.NODE_ENV === "production") {
      console.warn("⚠️ TURNSTILE_SECRET_KEY is missing in production environment");
    }
    return { success: true };
  }

  if (!token) {
    return {
      success: false,
      error: "Missing Turnstile anti-spam verification token",
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (ip) formData.append("remoteip", ip);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (data.success) {
      return { success: true };
    }

    return {
      success: false,
      error: "Turnstile verification failed. Please try again.",
    };
  } catch (err) {
    console.error("Turnstile API error:", err);
    // If Cloudflare is temporarily unreachable, allow or return error based on policy
    return { success: false, error: "Security check service temporarily unavailable." };
  }
}
