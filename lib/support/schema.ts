import { z } from "zod";

export const InquiryTypeEnum = z.enum([
  "question",
  "bug",
  "feedback",
  "account",
]);

export type InquiryType = z.infer<typeof InquiryTypeEnum>;

export const ProductSlugEnum = z.enum([
  "connectpi-web",
  "connectpi-app",
  "rushbox",
  "blade-rush",
  "shared",
]);

export type ProductSlug = z.infer<typeof ProductSlugEnum>;

export const ContactFormSchema = z
  .object({
    type: InquiryTypeEnum.default("question"),
    product: ProductSlugEnum.default("connectpi-web"),
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),
    email: z
      .string()
      .trim()
      .email("Please provide a valid email address")
      .max(120, "Email cannot exceed 120 characters"),
    username: z
      .string()
      .trim()
      .max(50, "Username cannot exceed 50 characters")
      .optional()
      .or(z.literal("")),
    subject: z
      .string()
      .trim()
      .min(5, "Subject must be at least 5 characters")
      .max(150, "Subject cannot exceed 150 characters"),
    message: z
      .string()
      .trim()
      .min(10, "Message must be at least 10 characters")
      .max(4000, "Message cannot exceed 4000 characters"),
    device: z.string().trim().max(100).optional().or(z.literal("")),
    os: z.string().trim().max(100).optional().or(z.literal("")),
    appVersion: z.string().trim().max(50).optional().or(z.literal("")),
    fromApp: z.string().optional().or(z.literal("")),
    consent: z.literal(true, {
      errorMap: () => ({ message: "You must consent to be contacted regarding this request" }),
    }),
    honeypot: z.string().max(0, "Bot detected").optional().or(z.literal("")),
    turnstileToken: z.string().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.type === "bug") {
      if (!data.device || data.device.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please tell us what device or phone model you are using",
          path: ["device"],
        });
      }
      if (!data.os || data.os.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please specify your Operating System (e.g. Android 13, Windows 11)",
          path: ["os"],
        });
      }
    }
  });

export type ContactFormData = z.infer<typeof ContactFormSchema>;
