import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Frontend Engineer at Vercel",
    quote:
      "Promtify completely changed how I build UIs. What used to take me hours now takes minutes. The template quality is incredible - every kit comes out production-ready.",
    initials: "SC",
  },
  {
    name: "Raj Patel",
    role: "Indie Hacker & Founder",
    quote:
      "As a solo founder, Promtify is my secret weapon. I shipped my entire SaaS landing page in an afternoon. The multi-framework support means I can prototype in HTML and ship in React.",
    initials: "RP",
  },
  {
    name: "Emily Rodriguez",
    role: "Design Lead at Stripe",
    quote:
      "The courses alone are worth the price. I've leveled up my team's design-to-code workflow and we're building consistent, beautiful interfaces faster than ever.",
    initials: "ER",
  },
] as const;

export function Testimonials() {
  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Loved by{" "}
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              developers
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            See what developers around the world are saying about Promtify.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
            >
              <Quote className="size-8 text-white/15" />
              <div className="mt-4 flex flex-1 flex-col justify-between gap-6">
                <p className="text-sm leading-relaxed text-slate-300">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="" alt={testimonial.name} />
                    <AvatarFallback className="bg-purple-500/20 text-purple-200">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
