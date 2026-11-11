import React, { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/nav/Breadcrumb";
import { ContactForm } from "@/components/forms/ContactForm";
import { Card } from "@/components/ui/Card";
import { Loader2, Mail, Clock, HelpCircle, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Support & Report a Bug",
  description: "Get in touch with the ConnectPi team. Submit questions, account issues, or bug reports.",
};

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const breadcrumbs = [
    { label: "Help Center", href: "/" },
    { label: "Contact us" },
  ];

  return (
    <div className="py-8 md:py-12 safe-padding-inline">
      <Container>
        <Breadcrumb items={breadcrumbs} />

        {/* Page Header */}
        <div className="max-w-2xl mb-8">
          <span className="text-xs uppercase tracking-wider font-semibold text-brand">
            Direct Support
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-ink mt-1">
            Contact ConnectPi Support
          </h1>
          <p className="mt-2 text-base text-ink-muted leading-relaxed">
            Need help with your account, found a bug, or have a suggestion? Fill out the form below and our team will get back to you.
          </p>
        </div>

        {/* 2-Column Responsive Layout (PRD 5.6 & RESPONSIVE_SPEC 3.7) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
          {/* Left Column: Contact Form (Spans 7 cols on Desktop) */}
          <div className="lg:col-span-7 xl:col-span-8 max-w-[640px]">
            <Suspense
              fallback={
                <div className="py-24 flex items-center justify-center text-ink-muted">
                  <Loader2 className="w-8 h-8 animate-spin text-brand" />
                </div>
              }
            >
              <ContactForm />
            </Suspense>
          </div>

          {/* Right Column: "Before You Write" Tips & Support Info (Spans 5 cols on Desktop) */}
          <aside
            aria-label="Support advice and hours"
            className="lg:col-span-5 xl:col-span-4 space-y-6"
          >
            {/* Quick Answers Card */}
            <Card className="p-6 bg-surface">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-5 h-5 text-brand" />
                <h2 className="font-heading font-bold text-lg text-ink">
                  Before you write
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mb-4">
                Many common questions are already answered in our instant troubleshooting guides:
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/connectpi-web/account/cant-login"
                    className="text-brand hover:underline font-medium block"
                  >
                    → I can&apos;t log in with Pi Browser
                  </Link>
                </li>
                <li>
                  <Link
                    href="/connectpi-web/getting-started/create-your-profile"
                    className="text-brand hover:underline font-medium block"
                  >
                    → How to create your profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shared/safety-privacy/privacy-overview"
                    className="text-brand hover:underline font-medium block"
                  >
                    → Privacy and account protection
                  </Link>
                </li>
              </ul>
            </Card>

            {/* Support Hours Card */}
            <Card className="p-6 bg-surface">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-brand" />
                <h2 className="font-heading font-bold text-lg text-ink">
                  Support Hours
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                Our support engineers monitor tickets Monday to Friday. You can typically expect a response within <strong>24 to 48 hours</strong>.
              </p>
            </Card>

            {/* Direct Email Card */}
            <div className="p-5 rounded-r-xl bg-surface-tint border border-brand/20 text-xs sm:text-sm text-ink flex items-start gap-3">
              <Mail className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-brand mb-1">
                  Prefer direct email?
                </span>
                <p className="text-ink-muted leading-relaxed">
                  Write directly to{" "}
                  <a
                    href="mailto:support@connectpi.in"
                    className="underline font-semibold text-ink hover:text-brand"
                  >
                    support@connectpi.in
                  </a>
                  . Include your username and screenshots where helpful.
                </p>
              </div>
            </div>

            {/* Passphrase Reminder */}
            <div className="p-4 rounded-r-xl border border-border bg-surface text-xs text-ink-muted flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-danger shrink-0 mt-0.5" />
              <span>
                <strong>Never share your 24-word Pi passphrase.</strong> Our support staff will never ask for private wallet keys.
              </span>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
