import { Resend } from "resend";
import { ContactFormData } from "./schema";
import products from "@/content/products.json";

export interface DeliveryResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function deliverContactMessage(
  data: ContactFormData,
  requestId: string
): Promise<DeliveryResult> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.SUPPORT_TO_EMAIL || "support@connectpi.in";
  const fromEmail = process.env.SUPPORT_FROM_EMAIL || "support@connectpi.in";

  const product = products.find((p) => p.slug === data.product);
  const productName = product ? product.name : data.product;

  const subject = `[ConnectPi Support][${productName}][${data.type.toUpperCase()}] ${data.subject}`;

  // If no Resend API key is configured (local dev mode / test):
  if (!resendApiKey) {
    console.log(
      `📧 [MOCK EMAIL DELIVERY] Request ID: ${requestId} | Subject: "${subject}" | User Type: ${data.type}`
    );
    return {
      success: true,
      messageId: `mock_${requestId}`,
    };
  }

  try {
    const resend = new Resend(resendApiKey);

    const emailContent = `
Request ID: ${requestId}
Inquiry Type: ${data.type}
Product: ${productName} (${data.product})
User: ${data.name} <${data.email}>
ConnectPi Username: ${data.username || "N/A"}
Referral Source: ${data.fromApp ? "From In-App Help Link" : "Web Help Center"}

${data.type === "bug" ? `--- Device Diagnostics ---
Device / Model: ${data.device}
Operating System: ${data.os}
App Version: ${data.appVersion || "Not specified"}
` : ""}
--- Message ---
${data.message}
    `.trim();

    const response = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: data.email,
      subject,
      text: emailContent,
    });

    if (response.error) {
      console.error(`Email delivery error for request ${requestId}:`, response.error.message);
      return { success: false, error: response.error.message };
    }

    return { success: true, messageId: response.data?.id };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown email error";
    console.error(`Failed to send email for request ${requestId}:`, errorMsg);
    return { success: false, error: errorMsg };
  }
}
