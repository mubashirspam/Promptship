import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export function CTASection() {
  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl px-6 py-16 text-center sm:px-12 sm:py-20",
            "bg-linear-to-br from-purple-600 via-cyan-600 to-orange-500"
          )}
        >
          {/* Decorative dot pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          {/* Decorative gradient blobs */}
          <div className="pointer-events-none absolute -top-20 -left-20 size-60 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 size-60 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Ready to Ship Faster?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              Join thousands of developers building beautiful UIs with AI.
              Start free - no credit card required.
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="min-w-[200px] bg-white text-foreground hover:bg-white/90"
              >
                <a href={`${siteConfig.appUrl}/signup`}>
                  Get Started Free
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
