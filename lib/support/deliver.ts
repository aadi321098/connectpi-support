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

    const emailText = `
======================================================================
NEW SUPPORT INQUIRY - CONNECTPI HELP CENTER
======================================================================
Ticket Reference ID : #${requestId}
Date / Time         : ${new Date().toUTCString()}
Product Vertical    : ${productName} (${data.product})
Inquiry Category    : ${data.type.toUpperCase()}
Subject             : ${data.subject}

----------------------------------------------------------------------
USER DETAILS:
----------------------------------------------------------------------
Full Name           : ${data.name}
Email Address       : ${data.email}
ConnectPi Username  : ${data.username || "Not specified"}
Referral Source     : ${data.fromApp ? `In-App Referral (${data.fromApp})` : "Web Help Center (support.connectpi.in)"}

${data.type === "bug" ? `----------------------------------------------------------------------
DIAGNOSTICS (BUG REPORT):
----------------------------------------------------------------------
Device / Model      : ${data.device}
Operating System    : ${data.os}
App Version         : ${data.appVersion || "Not specified"}
` : ""}
----------------------------------------------------------------------
USER MESSAGE:
----------------------------------------------------------------------
${data.message}

======================================================================
NOTE: Hitting 'Reply' in your email client will reply directly to ${data.email}.
======================================================================
    `.trim();

    const emailHtml = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #E6E0F5; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(27, 21, 48, 0.05);">
  <div style="background: #2A1668; padding: 24px; color: #ffffff;">
    <span style="background: #5B2FC9; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 8px; border-radius: 4px; letter-spacing: 0.5px;">${data.type.toUpperCase()}</span>
    <h2 style="margin: 12px 0 4px 0; font-size: 20px; font-weight: 700; color: #ffffff;">Ticket #${requestId.slice(0, 8)}</h2>
    <p style="margin: 0; font-size: 13px; color: #C9C2E3;">Product: <strong>${productName}</strong></p>
  </div>
  <div style="padding: 24px;">
    <div style="background: #FAF8FF; border: 1px solid #E6E0F5; border-radius: 8px; padding: 14px 16px; margin-bottom: 20px;">
      <span style="font-size: 11px; text-transform: uppercase; color: #5E5878; font-weight: 700; display: block; margin-bottom: 4px;">Subject:</span>
      <span style="font-size: 16px; font-weight: 700; color: #1B1530;">${data.subject}</span>
    </div>

    <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
      <tr><td style="padding: 8px 0; color: #5E5878; width: 150px; border-bottom: 1px solid #F4F1FF;"><strong>User Name:</strong></td><td style="color: #1B1530; border-bottom: 1px solid #F4F1FF;">${data.name}</td></tr>
      <tr><td style="padding: 8px 0; color: #5E5878; border-bottom: 1px solid #F4F1FF;"><strong>User Email:</strong></td><td style="color: #1B1530; border-bottom: 1px solid #F4F1FF;"><a href="mailto:${data.email}" style="color: #5B2FC9; font-weight: 600;">${data.email}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #5E5878; border-bottom: 1px solid #F4F1FF;"><strong>ConnectPi User:</strong></td><td style="color: #1B1530; border-bottom: 1px solid #F4F1FF;">${data.username || "N/A"}</td></tr>
      <tr><td style="padding: 8px 0; color: #5E5878; border-bottom: 1px solid #F4F1FF;"><strong>Referral Source:</strong></td><td style="color: #1B1530; border-bottom: 1px solid #F4F1FF;">${data.fromApp ? `In-App (${data.fromApp})` : "Web Help Center"}</td></tr>
      ${data.type === "bug" ? `
      <tr><td style="padding: 8px 0; color: #5E5878; border-bottom: 1px solid #F4F1FF;"><strong>Device Model:</strong></td><td style="color: #1B1530; border-bottom: 1px solid #F4F1FF;">${data.device}</td></tr>
      <tr><td style="padding: 8px 0; color: #5E5878; border-bottom: 1px solid #F4F1FF;"><strong>Operating System:</strong></td><td style="color: #1B1530; border-bottom: 1px solid #F4F1FF;">${data.os}</td></tr>
      <tr><td style="padding: 8px 0; color: #5E5878; border-bottom: 1px solid #F4F1FF;"><strong>App Version:</strong></td><td style="color: #1B1530; border-bottom: 1px solid #F4F1FF;">${data.appVersion || "N/A"}</td></tr>
      ` : ""}
    </table>

    <div style="margin-top: 16px;">
      <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #5E5878; display: block; margin-bottom: 8px;">Message:</span>
      <div style="background: #FAF8FF; border-left: 4px solid #5B2FC9; padding: 16px; border-radius: 6px; font-size: 14px; line-height: 1.6; color: #2F2848; white-space: pre-wrap;">${data.message}</div>
    </div>
  </div>
  <div style="background: #F4F1FF; padding: 14px 24px; font-size: 12px; color: #5E5878; border-top: 1px solid #E6E0F5;">
    💡 <strong>Tip:</strong> Simply hit <strong>Reply</strong> in your email client to respond directly to <strong>${data.name}</strong> (${data.email}).
  </div>
</div>
    `.trim();

    const response = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: data.email,
      subject,
      text: emailText,
      html: emailHtml,
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

Thank you for contacting ConnectPi Support. We have safely received your request.

--- Ticket Summary ---
• Ticket ID: #${requestId}
• Product: ${productName}
• Request Type: ${data.type.toUpperCase()}
• Subject: ${data.subject}

Our support team is currently reviewing your inquiry and will follow up with you within 24 to 48 business hours at this email address (${data.email}).

If you have additional details, logs, or screenshots to share, please retain this Ticket ID for your reference.

Best regards,
ConnectPi Support Team
https://support.connectpi.in

======================================================================
NOTE: This is an automated notification confirming your ticket submission. Please do not reply directly to this automated email.
======================================================================
      `.trim();

      const userHtml = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E6E0F5; border-radius: 12px; overflow: hidden;">
  <div style="background: #2A1668; padding: 24px; color: #ffffff;">
    <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff;">Request Received</h2>
    <p style="margin: 4px 0 0 0; font-size: 13px; color: #C9C2E3;">ConnectPi Support Help Center</p>
  </div>
  <div style="padding: 24px;">
    <p style="font-size: 15px; color: #1B1530; margin-top: 0;">Hi <strong>${data.name}</strong>,</p>
    <p style="font-size: 14px; color: #2F2848; line-height: 1.6;">Thank you for contacting ConnectPi Support. We have safely received your request.</p>

    <div style="background: #FAF8FF; border: 1px solid #E6E0F5; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr><td style="padding: 4px 0; color: #5E5878; width: 130px;"><strong>Ticket ID:</strong></td><td style="color: #1B1530; font-family: monospace; font-weight: 700;">#${requestId}</td></tr>
        <tr><td style="padding: 4px 0; color: #5E5878;"><strong>Product:</strong></td><td style="color: #1B1530;">${productName}</td></tr>
        <tr><td style="padding: 4px 0; color: #5E5878;"><strong>Category:</strong></td><td style="color: #1B1530; text-transform: uppercase;">${data.type}</td></tr>
        <tr><td style="padding: 4px 0; color: #5E5878;"><strong>Subject:</strong></td><td style="color: #1B1530; font-weight: 600;">${data.subject}</td></tr>
      </table>
    </div>

    <p style="font-size: 14px; color: #2F2848; line-height: 1.6;">Our support team is currently reviewing your inquiry and will contact you within <strong>24 to 48 business hours</strong> at this email address (${data.email}).</p>
    <p style="font-size: 14px; color: #5E5878; line-height: 1.6;">If you have additional details, logs, or screenshots to share, please retain this Ticket ID for your reference.</p>
  </div>
  <div style="background: #FAF8FF; padding: 16px 24px; font-size: 12px; color: #5E5878; border-top: 1px solid #E6E0F5;">
    <p style="margin: 0 0 6px 0;"><strong>ConnectPi Support Team</strong> • <a href="https://support.connectpi.in" style="color: #5B2FC9; text-decoration: none;">support.connectpi.in</a></p>
    <p style="margin: 0; font-size: 11px; color: #5E5878;">NOTE: This is an automated notification confirming your ticket submission. Please do not reply directly to this automated email.</p>
  </div>
</div>
      `.trim();

      await resend.emails.send({
        from: fromEmail,
        to: data.email,
        subject: userSubject,
        text: userContent,
        html: userHtml,
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
