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
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              build faster
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Promtify gives you the tools, prompts, and knowledge to ship
            beautiful user interfaces at record speed.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-purple-500/15 text-purple-300">
                <feature.icon className="size-5" />
              </div>
              <h3 className="font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
