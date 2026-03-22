import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FileText, Sparkles, Code, GraduationCap } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "100+ Curated Prompts",
    description:
      "Hand-crafted prompts for every UI pattern, from landing pages and dashboards to complex data tables and authentication flows.",
  },
  {
    icon: Sparkles,
    title: "One-Click Generation",
    description:
      "Generate production-ready code instantly with AI. Just pick a prompt, choose your framework, and get clean, usable components.",
  },
  {
    icon: Code,
    title: "Multi-Framework",
    description:
      "React, Flutter, HTML, Vue - one prompt, any framework. Write once, generate everywhere with consistent, high-quality output.",
  },
  {
    icon: GraduationCap,
    title: "Learn & Master",
    description:
      "Comprehensive video courses that teach you to craft better prompts, build faster UIs, and master AI-assisted development.",
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
            PromptShip gives you the tools, prompts, and knowledge to ship
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
