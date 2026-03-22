import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
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
      "PromptShip completely changed how I build UIs. What used to take me hours now takes minutes. The prompt quality is incredible - every component comes out production-ready.",
    initials: "SC",
  },
  {
    name: "Raj Patel",
    role: "Indie Hacker & Founder",
    quote:
      "As a solo founder, PromptShip is my secret weapon. I shipped my entire SaaS landing page in an afternoon. The multi-framework support means I can prototype in HTML and ship in React.",
    initials: "RP",
  },
  {
    name: "Emily Rodriguez",
    role: "Design Lead at Stripe",
    quote:
      "The courses alone are worth the subscription. I've leveled up my team's prompt engineering skills and we're building consistent, beautiful interfaces faster than ever.",
    initials: "ER",
  },
] as const;

export function Testimonials() {
  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by{" "}
            <span className="gradient-text">developers</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            See what developers around the world are saying about PromptShip.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className={cn(
                "flex flex-col transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-lg"
              )}
            >
              <CardHeader>
                <Quote className="size-8 text-muted-foreground/30" />
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-6">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="" alt={testimonial.name} />
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
