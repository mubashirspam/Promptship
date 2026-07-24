"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqItems = [
  {
    question: "What is Promtify?",
    answer:
      "Promtify is a premium template marketplace: Figma Kits, AI Prompts and Code Starters for web and mobile apps. Browse everything free, then pay once for lifetime access — download the design file, copy the prompt, or grab the full source code.",
  },
  {
    question: "Which frameworks and platforms are covered?",
    answer:
      "Web: React, Next.js, Vue and HTML/CSS. Mobile: Flutter, React Native, Kotlin and Swift. Every template is tagged by platform and stack, and Figma Kits cover both web and mobile app designs.",
  },
  {
    question: "What exactly do I get when I unlock a template?",
    answer:
      "Figma Kits give you the Figma file link to duplicate and edit. AI Prompts give you the full markdown prompt to paste into Claude, Cursor or v0. Code Starters give you a downloadable zip with complete source. Many templates include a prompt alongside the design or code.",
  },
  {
    question: "Do I have to pay to try it?",
    answer:
      "No. Browsing and previews are completely free, and free templates are usable by everyone. Paid templates unlock with a plan — Basic (all Figma Kits), Pro (adds all AI Prompts) or Premium (adds all Code Starters) — or buy any single template on its own.",
  },
  {
    question: "Is it really a one-time payment?",
    answer:
      "Yes. Every plan is a single lifetime purchase — no subscriptions, no renewals. You keep access to everything in your plan forever, including all new templates added to it every week.",
  },
  {
    question: "What's included in the courses?",
    answer:
      "Courses are a simple $7 lifetime add-on to any plan: prompt engineering for UI, advanced Tailwind, building design systems with AI, and framework deep dives. New lessons are included as they ship.",
  },
  {
    question: "Do I keep getting new prompts and updates?",
    answer:
      "Yes. New templates land every week and drop straight into your plan at no extra cost. Basic keeps getting every new Figma Kit, Pro every new AI Prompt, Premium everything — forever.",
  },
  {
    question: "Can I try before I buy?",
    answer:
      "Yes — that's the whole point. Browse the entire catalog free, watch every preview, and use the free templates with no account limits. Buy a plan only when you've seen exactly what you're getting: as digital goods, all sales are final.",
  },
] as const;

export function FAQAccordion() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="relative z-10 mx-auto max-w-3xl px-4 pt-24 pb-32 sm:px-6 lg:px-8">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white md:text-5xl">
          Frequently asked{" "}
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            questions
          </span>
        </h2>
        <p className="text-lg font-medium text-slate-400">
          Everything you need to know about Promtify.
        </p>
      </div>

      <div className="space-y-4">
        {faqItems.map((faq, index) => {
          const isOpen = openFaq === index;
          return (
            <div
              key={index}
              className={`overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
                isOpen
                  ? "border-purple-500/30 bg-white/[0.05] shadow-[0_0_30px_-10px_rgba(168,85,247,0.15)]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              <button
                onClick={() => setOpenFaq(isOpen ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
                aria-expanded={isOpen}
              >
                <span
                  className={`pr-4 text-base font-semibold transition-colors duration-300 md:text-lg ${
                    isOpen ? "text-white" : "text-slate-200"
                  }`}
                >
                  {faq.question}
                </span>
                <div
                  className={`shrink-0 rounded-full p-1.5 transition-all duration-300 ${
                    isOpen
                      ? "rotate-180 bg-purple-500/20 text-purple-400"
                      : "bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  <ChevronDown size={20} />
                </div>
              </button>
              <div
                className="grid px-6 transition-all duration-300 ease-in-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="pb-6 text-sm leading-relaxed text-slate-400 md:text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
