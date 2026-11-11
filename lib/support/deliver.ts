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

    // Automated Confirmation Email to User
    try {
      const userSubject = `[ConnectPi Support] Ticket Received: ${data.subject} (#${requestId})`;
      const userContent = `
Hi ${data.name},

Thank you for reaching out to ConnectPi Support! We have received your request.

--- Your Ticket Details ---
• Ticket ID: #${requestId}
• Product: ${productName}
• Request Type: ${data.type.toUpperCase()}
• Subject: ${data.subject}

Our support team is reviewing your inquiry and will contact you within 24 to 48 hours at this email address (${data.email}).

If you have additional details or screenshots to share, please hold on to this Ticket ID for quick reference.

Best regards,
ConnectPi Support Team
https://help.connectpi.in

==================================================
NOTE: Yeh ek automated confirmation email hai to confirm that your request was safely received. Kripya is automated email ka direct reply na karein.
==================================================
      `.trim();

      await resend.emails.send({
        from: fromEmail,
        to: data.email,
        subject: userSubject,
        text: userContent,
      });
      console.log(`✉️ Automated confirmation sent to user: ${data.email} for ticket ${requestId}`);
    } catch (autoErr) {
      // Non-blocking: Admin ticket is already delivered safely
      console.warn(`[Auto-responder] Could not send confirmation to ${data.email}:`, autoErr);
    }

    return { success: true, messageId: response.data?.id };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown email error";
    console.error(`Failed to send email for request ${requestId}:`, errorMsg);
    return { success: false, error: errorMsg };
  }
}
