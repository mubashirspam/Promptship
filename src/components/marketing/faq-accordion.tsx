"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked{" "}
            <span className="gradient-text">questions</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Everything you need to know about Promtify.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
