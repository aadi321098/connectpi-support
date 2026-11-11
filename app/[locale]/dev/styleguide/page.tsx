"use client";

import React, { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { ArrowRight, Check, AlertTriangle, Shield, Coins, Sparkles } from "lucide-react";

export default function StyleguidePage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="py-12 safe-padding-inline">
      <Container>
        <div className="border-b border-border pb-6 mb-8">
          <span className="text-xs uppercase tracking-wider font-semibold text-brand">
            Developer Preview
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-ink mt-1">
            Design System & Component Styleguide
          </h1>
          <p className="text-ink-muted text-sm sm:text-base mt-2">
            Reference catalogue for design tokens, typography, and interactive components.
          </p>
        </div>

        {/* Color Palette Tokens */}
        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold text-ink mb-4">
            Color Tokens
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { name: "Brand", bg: "bg-brand", text: "text-white" },
              { name: "Brand Hover", bg: "bg-brand-hover", text: "text-white" },
              { name: "Brand Deep", bg: "bg-brand-deep", text: "text-white" },
              { name: "Accent", bg: "bg-accent", text: "text-ink" },
              { name: "Surface Tint", bg: "bg-surface-tint", text: "text-brand" },
              { name: "Ink (Text)", bg: "bg-ink", text: "text-white" },
              { name: "Ink Body", bg: "bg-ink-body", text: "text-white" },
              { name: "Ink Muted", bg: "bg-ink-muted", text: "text-white" },
              { name: "Border", bg: "bg-border", text: "text-ink" },
              { name: "Success", bg: "bg-success", text: "text-white" },
              { name: "Danger", bg: "bg-danger", text: "text-white" },
              { name: "Focus Ring", bg: "bg-focus", text: "text-white" },
            ].map((token) => (
              <div
                key={token.name}
                className="p-3 rounded-r-md border border-border shadow-sm flex flex-col justify-between h-24 bg-surface"
              >
                <div
                  className={`w-full h-8 rounded-r-sm ${token.bg} flex items-center justify-center text-xs font-semibold ${token.text}`}
                >
                  Sample
                </div>
                <span className="text-xs font-medium text-ink mt-2">
                  {token.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons Section */}
        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold text-ink mb-4">
            Buttons
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="accent">Accent Action</Button>
            <Button
              variant="primary"
              isLoading={loading}
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 2000);
              }}
              rightIcon={<Sparkles className="w-4 h-4 ml-1" />}
            >
              {loading ? "Saving..." : "Click to Test Loading"}
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <Button variant="secondary" size="small">
              Small Button
            </Button>
            <Button variant="accent" size="large">
              Large Hero CTA
            </Button>
          </div>
        </section>

        {/* Chips Section */}
        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold text-ink mb-4">
            Chips
          </h2>
          <div className="flex flex-wrap items-center gap-2.5">
            <Chip variant="tinted" leftIcon={<Coins className="w-4 h-4" />}>
              Loyalty Points
            </Chip>
            <Chip variant="active" leftIcon={<Check className="w-4 h-4" />}>
              Active Filter
            </Chip>
            <div className="p-4 bg-brand-deep rounded-r-lg inline-flex gap-2">
              <Chip variant="outlined">Outlined on Dark</Chip>
              <Chip variant="outlined" leftIcon={<Shield className="w-4 h-4" />}>
                Security
              </Chip>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold text-ink mb-4">
            Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="flex flex-col gap-2">
              <span className="text-xs uppercase font-bold text-ink-muted">
                Static Card
              </span>
              <h3 className="font-heading font-bold text-lg text-ink">
                Informational Card
              </h3>
              <p className="text-sm text-ink-muted">
                Standard container with border token, surface background, and rounded-r-xl border radius.
              </p>
            </Card>

            <Card href="#interactive" className="flex flex-col gap-2 group">
              <span className="text-xs uppercase font-bold text-brand">
                Interactive Link Card
              </span>
              <h3 className="font-heading font-bold text-lg text-ink group-hover:text-brand transition-colors">
                Hover to Test States
              </h3>
              <p className="text-sm text-ink-muted">
                Includes border transition, subtle elevation, and keyboard focus visible ring.
              </p>
              <div className="mt-2 flex items-center text-sm font-semibold text-brand">
                <span>View Details</span>
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Card>

            <Card className="flex flex-col gap-2 border-l-4 border-l-brand">
              <span className="text-xs uppercase font-bold text-brand">
                Featured Accent Card
              </span>
              <h3 className="font-heading font-bold text-lg text-ink">
                Highlighted Topic
              </h3>
              <p className="text-sm text-ink-muted">
                Card with customized left accent border for featured announcements.
              </p>
            </Card>
          </div>
        </section>

        {/* Icons Section */}
        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold text-ink mb-4">
            Icon Primitives
          </h2>
          <div className="flex items-center gap-4 text-brand">
            <div className="w-10 h-10 rounded-r-md bg-surface-tint flex items-center justify-center">
              <Icon name="check" size={20} />
            </div>
            <div className="w-10 h-10 rounded-r-md bg-surface-tint flex items-center justify-center">
              <Icon name="user" size={20} />
            </div>
            <div className="w-10 h-10 rounded-r-md bg-surface-tint flex items-center justify-center">
              <Icon name="message-square" size={20} />
            </div>
            <div className="w-10 h-10 rounded-r-md bg-surface-tint flex items-center justify-center">
              <Icon name="coins" size={20} />
            </div>
            <div className="w-10 h-10 rounded-r-md bg-surface-tint flex items-center justify-center text-danger">
              <Icon name="alert-triangle" size={20} />
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
