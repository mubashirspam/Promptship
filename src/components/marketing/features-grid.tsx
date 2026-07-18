import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Figma, Sparkles, Code, GraduationCap } from "lucide-react";

const features = [
  {
    icon: Figma,
    title: "Figma Kits",
    description:
      "Full website and mobile-app design kits plus single components — auto-layout, organized, ready to duplicate into your drafts and customize.",
  },
  {
    icon: Sparkles,
    title: "AI Prompts",
    description:
      "Battle-tested markdown prompts for every UI pattern. Paste into Claude, Cursor or v0 and get production-ready screens in one shot.",
  },
  {
    icon: Code,
    title: "Code Starters",
    description:
      "Download complete source — full sites and components for React, Next.js, Flutter, React Native, Kotlin, Swift and more. Unzip and ship.",
  },
  {
    icon: GraduationCap,
    title: "Video Courses",
    description:
      "A $7 add-on: the full course library on building with AI, design systems and framework deep dives. One payment, lifetime access.",
  },
] as const;

export function FeaturesGrid() {
  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to{" "}
            <span className="gradient-text">build faster</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Promtify gives you the tools, prompts, and knowledge to ship
            beautiful user interfaces at record speed.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className={cn(
                "transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-lg hover:ring-foreground/20"
              )}
            >
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="size-5 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
