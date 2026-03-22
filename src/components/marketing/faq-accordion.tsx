"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "What is PromptShip?",
    answer:
      "PromptShip is a curated library of 100+ UI prompts paired with AI-powered code generation. It helps developers build beautiful, production-ready interfaces in minutes instead of hours - across React, Flutter, HTML, and Vue.",
  },
  {
    question: "What frameworks are supported?",
    answer:
      "PromptShip currently supports React (with Tailwind CSS), Flutter (Dart), plain HTML/CSS, and Vue.js. Each prompt generates framework-specific, idiomatic code that follows best practices for the chosen framework.",
  },
  {
    question: "How does AI generation work?",
    answer:
      "Select a prompt, choose your target framework, and click generate. Our AI engine (powered by Claude and GPT-4) takes the curated prompt and produces clean, production-ready component code with proper styling, accessibility, and responsive design built in.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes! You can browse and preview all prompts for free. The Starter plan gives you access to 50 premium prompts with a one-time purchase. For unlimited access, AI generation, and courses, check out our Pro plan.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Absolutely. You can cancel your Pro or Team subscription at any time from your account settings. You will retain access to all features until the end of your current billing period. There are no cancellation fees.",
  },
  {
    question: "What's included in the courses?",
    answer:
      "Pro subscribers get full access to our video course library covering prompt engineering for UI, advanced Tailwind CSS techniques, building design systems with AI, and framework-specific deep dives. New courses are added monthly.",
  },
  {
    question: "Do I get updates?",
    answer:
      "Yes. New prompts are added weekly, and all plans include lifetime updates to existing prompts. Pro and Team subscribers also get early access to new features, frameworks, and prompt categories as they launch.",
  },
  {
    question: "Is there a team plan?",
    answer:
      "Yes! Our Team plan includes 5 seats, 500 AI generations per month, API access, custom branding options, and dedicated support. It is designed for agencies and development teams who want to standardize their UI workflow.",
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
            Everything you need to know about PromptShip.
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
