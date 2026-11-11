import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16 safe-padding-inline">
      <Container className="text-center max-w-lg">
        <span className="w-16 h-16 rounded-r-xl bg-surface-tint text-brand flex items-center justify-center font-heading font-bold text-2xl mx-auto mb-6">
          404
        </span>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-ink">
          Page not found
        </h1>
        <p className="mt-3 text-sm sm:text-base text-ink-muted">
          Sorry, we couldn’t find the page or article you’re looking for. It may have been moved or deleted.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/" variant="primary" leftIcon={<Home className="w-4 h-4" />}>
            Back to Home
          </Button>
          <Button href="/contact" variant="secondary">
            Contact Support
          </Button>
        </div>
      </Container>
    </div>
  );
}
