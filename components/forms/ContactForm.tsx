"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Field } from "./Field";
import { TurnstileWidget } from "./TurnstileWidget";
import { Button } from "@/components/ui/Button";
import {
  ContactFormData,
  ContactFormSchema,
  InquiryType,
  ProductSlug,
} from "@/lib/support/schema";
import {
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Send,
  RotateCcw,
} from "lucide-react";
import products from "@/content/products.json";

export function ContactForm() {
  const searchParams = useSearchParams();
  const initialApp = (searchParams.get("app") as ProductSlug) || "connectpi-web";
  const initialType = (searchParams.get("type") as InquiryType) || "question";
  const fromAppParam = searchParams.get("from");

  const [formData, setFormData] = useState<Partial<ContactFormData>>({
    product: initialApp,
    type: initialType,
    name: "",
    email: "",
    username: "",
    subject: "",
    message: "",
    device: "",
    os: "",
    appVersion: "",
    fromApp: fromAppParam || "",
    consent: true,
    honeypot: "",
    turnstileToken: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formState, setFormState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [serverError, setServerError] = useState<string>("");
  const [requestId, setRequestId] = useState<string>("");

  const updateField = (field: keyof ContactFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for that field on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    // 1. Client-side Zod Validation
    const validation = ContactFormSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const path = issue.path[0];
        if (path && typeof path === "string" && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    // Client-side Turnstile check
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (siteKey && (!formData.turnstileToken || formData.turnstileToken.trim().length === 0)) {
      setErrors((prev) => ({
        ...prev,
        turnstileToken: "Please complete the security check above before submitting.",
      }));
      return;
    }

    setErrors({});
    setFormState("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormState("error");
        setServerError(
          data.error || "Unable to send message. Please try again or email us directly."
        );
        return;
      }

      setRequestId(data.requestId || "");
      setFormState("success");
    } catch {
      setFormState("error");
      setServerError("Network error. Please check your connection and try again.");
    }
  };

  if (formState === "success") {
    return (
      <div className="p-6 sm:p-8 rounded-r-xl border border-success/30 bg-success/5 shadow-xs">
        <div className="w-12 h-12 rounded-r-lg bg-success/20 text-success flex items-center justify-center mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="font-heading font-bold text-xl sm:text-2xl text-ink">
          Message Received!
        </h3>
        <p className="mt-2 text-sm sm:text-base text-ink-muted leading-relaxed">
          Thank you for reaching out. We have logged your request under ticket reference:
        </p>
        <div className="my-4 p-3 bg-surface rounded-r-md border border-border inline-block font-mono text-xs sm:text-sm font-semibold text-ink">
          Ref: {requestId || "SUBMISSION_OK"}
        </div>
        <div className="mt-2 text-sm text-ink-body space-y-2">
          <p><strong>What happens next?</strong></p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-ink-muted">
            <li>Our team typically replies to your email within 24–48 hours.</li>
            <li>Replies will be delivered directly to <strong>{formData.email}</strong>.</li>
          </ul>
        </div>
        <div className="mt-6 pt-6 border-t border-border">
          <Button
            variant="secondary"
            size="small"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                subject: "",
                message: "",
              }));
              setFormState("idle");
            }}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  const messageLength = formData.message?.length || 0;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Referral from App Banner if detected */}
      {fromAppParam && (
        <div className="p-3.5 rounded-r-lg bg-surface-tint border border-brand/20 flex items-center gap-2.5 text-xs text-brand font-medium">
          <Smartphone className="w-4 h-4 shrink-0" />
          <span>Opened from ConnectPi In-App Help. Your app context will be automatically included.</span>
        </div>
      )}

      {/* Global Error Notice */}
      {formState === "error" && (
        <div
          role="alert"
          className="p-4 rounded-r-lg bg-danger/10 border border-danger/30 flex items-start gap-3 text-sm text-danger"
        >
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{serverError}</p>
            <p className="mt-1 text-xs text-ink-muted">
              You can also reach our engineering team directly at{" "}
              <a href="mailto:support@connectpi.in" className="underline font-semibold text-brand">
                support@connectpi.in
              </a>.
            </p>
          </div>
        </div>
      )}

      {/* Honeypot field (strictly hidden from genuine users) */}
      <div style={{ display: "none" }} aria-hidden="true">
        <label htmlFor="hp_field">Do not fill this field</label>
        <input
          id="hp_field"
          type="text"
          name="honeypot"
          value={formData.honeypot || ""}
          onChange={(e) => updateField("honeypot", e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Product & Inquiry Type Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Product Select */}
        <Field id="contact-product" label="Which product?" required error={errors.product}>
          {({ id, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedby }) => (
            <select
              id={id}
              value={formData.product}
              onChange={(e) => updateField("product", e.target.value)}
              aria-invalid={ariaInvalid}
              aria-describedby={ariaDescribedby}
              className="w-full min-h-[48px] px-3.5 py-2.5 rounded-r-md bg-surface text-ink text-base border border-border focus:ring-2 focus:ring-focus focus:outline-none cursor-pointer"
            >
              {products.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
              <option value="shared">All Apps / General Ecosystem</option>
            </select>
          )}
        </Field>

        {/* Inquiry Type Select */}
        <Field id="contact-type" label="Inquiry type" required error={errors.type}>
          {({ id, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedby }) => (
            <select
              id={id}
              value={formData.type}
              onChange={(e) => updateField("type", e.target.value)}
              aria-invalid={ariaInvalid}
              aria-describedby={ariaDescribedby}
              className="w-full min-h-[48px] px-3.5 py-2.5 rounded-r-md bg-surface text-ink text-base border border-border focus:ring-2 focus:ring-focus focus:outline-none cursor-pointer"
            >
              <option value="question">Question / How do I?</option>
              <option value="bug">Bug Report / Something Broken</option>
              <option value="account">Account & Login Issue</option>
              <option value="feedback">Feedback & Feature Suggestion</option>
            </select>
          )}
        </Field>
      </div>

      {/* Conditional Diagnostics (Revealed only when type === 'bug') */}
      {formData.type === "bug" && (
        <div className="p-4 rounded-r-lg bg-surface border border-border/80 space-y-4 animate-in fade-in">
          <span className="text-xs uppercase font-bold text-brand block">
            Bug Report Diagnostics
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              id="contact-device"
              label="Device / Phone Model"
              required
              description="e.g. Samsung Galaxy S23, iPhone 14, PC"
              error={errors.device}
            >
              {({ id, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedby }) => (
                <input
                  id={id}
                  type="text"
                  value={formData.device || ""}
                  onChange={(e) => updateField("device", e.target.value)}
                  placeholder="e.g. Xiaomi Redmi Note 12"
                  aria-invalid={ariaInvalid}
                  aria-describedby={ariaDescribedby}
                  className="w-full min-h-[48px] px-3.5 py-2.5 rounded-r-md bg-surface text-ink text-base border border-border focus:ring-2 focus:ring-focus focus:outline-none"
                />
              )}
            </Field>

            <Field
              id="contact-os"
              label="Operating System"
              required
              description="e.g. Android 13, iOS 17, Windows 11"
              error={errors.os}
            >
              {({ id, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedby }) => (
                <input
                  id={id}
                  type="text"
                  value={formData.os || ""}
                  onChange={(e) => updateField("os", e.target.value)}
                  placeholder="e.g. Android 13 / Pi Browser 1.6"
                  aria-invalid={ariaInvalid}
                  aria-describedby={ariaDescribedby}
                  className="w-full min-h-[48px] px-3.5 py-2.5 rounded-r-md bg-surface text-ink text-base border border-border focus:ring-2 focus:ring-focus focus:outline-none"
                />
              )}
            </Field>
          </div>
        </div>
      )}

      {/* Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field id="contact-name" label="Your Name" required error={errors.name}>
          {({ id, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedby }) => (
            <input
              id={id}
              type="text"
              autoComplete="name"
              value={formData.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g. Aditya Singh"
              aria-invalid={ariaInvalid}
              aria-describedby={ariaDescribedby}
              className="w-full min-h-[48px] px-3.5 py-2.5 rounded-r-md bg-surface text-ink text-base border border-border focus:ring-2 focus:ring-focus focus:outline-none"
            />
          )}
        </Field>

        <Field id="contact-email" label="Your Email" required error={errors.email}>
          {({ id, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedby }) => (
            <input
              id={id}
              type="email"
              inputMode="email"
              autoComplete="email"
              value={formData.email || ""}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="name@example.com"
              aria-invalid={ariaInvalid}
              aria-describedby={ariaDescribedby}
              className="w-full min-h-[48px] px-3.5 py-2.5 rounded-r-md bg-surface text-ink text-base border border-border focus:ring-2 focus:ring-focus focus:outline-none"
            />
          )}
        </Field>
      </div>

      {/* ConnectPi Username & Subject */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          id="contact-username"
          label="ConnectPi Username (optional)"
          description="If your issue relates to your account"
          error={errors.username}
        >
          {({ id, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedby }) => (
            <input
              id={id}
              type="text"
              value={formData.username || ""}
              onChange={(e) => updateField("username", e.target.value)}
              placeholder="@username"
              aria-invalid={ariaInvalid}
              aria-describedby={ariaDescribedby}
              className="w-full min-h-[48px] px-3.5 py-2.5 rounded-r-md bg-surface text-ink text-base border border-border focus:ring-2 focus:ring-focus focus:outline-none"
            />
          )}
        </Field>

        <Field id="contact-subject" label="Subject" required error={errors.subject}>
          {({ id, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedby }) => (
            <input
              id={id}
              type="text"
              value={formData.subject || ""}
              onChange={(e) => updateField("subject", e.target.value)}
              placeholder="Brief summary of your question"
              aria-invalid={ariaInvalid}
              aria-describedby={ariaDescribedby}
              className="w-full min-h-[48px] px-3.5 py-2.5 rounded-r-md bg-surface text-ink text-base border border-border focus:ring-2 focus:ring-focus focus:outline-none"
            />
          )}
        </Field>
      </div>

      {/* Message Textarea with 4000 character limit counter */}
      <Field
        id="contact-message"
        label="Message"
        required
        description="Please provide as much detail as possible to help us investigate."
        error={errors.message}
      >
        {({ id, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedby }) => (
          <div className="relative">
            <textarea
              id={id}
              rows={5}
              maxLength={4000}
              value={formData.message || ""}
              onChange={(e) => updateField("message", e.target.value)}
              placeholder="Describe what happened, error messages seen, and what steps you've tried..."
              aria-invalid={ariaInvalid}
              aria-describedby={ariaDescribedby}
              className="w-full p-3.5 rounded-r-md bg-surface text-ink text-base border border-border focus:ring-2 focus:ring-focus focus:outline-none resize-y min-h-[140px]"
            />
            <div className="text-right text-xs text-ink-muted mt-1 font-mono">
              {messageLength} / 4000 characters
            </div>
          </div>
        )}
      </Field>

      {/* Turnstile Anti-Spam Widget */}
      <div>
        <TurnstileWidget
          onVerify={(token) => {
            updateField("turnstileToken", token);
            if (errors.turnstileToken) {
              setErrors((prev) => {
                const next = { ...prev };
                delete next.turnstileToken;
                return next;
              });
            }
          }}
        />
        {errors.turnstileToken && (
          <div className="flex items-center gap-1.5 text-xs text-danger mt-1.5 font-medium animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 text-danger" />
            <span>{errors.turnstileToken}</span>
          </div>
        )}
      </div>

      {/* Privacy Consent Checkbox */}
      <div className="flex items-start gap-2.5">
        <input
          id="contact-consent"
          type="checkbox"
          checked={Boolean(formData.consent)}
          onChange={(e) => updateField("consent", e.target.checked)}
          className="mt-1 w-4 h-4 rounded text-brand focus:ring-focus border-border cursor-pointer"
        />
        <label htmlFor="contact-consent" className="text-xs sm:text-sm text-ink-muted cursor-pointer select-none">
          I consent to ConnectPi Support processing my email and diagnostics to respond to this inquiry.
        </label>
      </div>
      {errors.consent && (
        <p className="text-xs text-danger -mt-4">{errors.consent}</p>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="large"
        isLoading={formState === "submitting"}
        className="w-full sm:w-auto min-w-[200px]"
        rightIcon={<Send className="w-4 h-4 ml-1" />}
      >
        Send Message
      </Button>
    </form>
  );
}
