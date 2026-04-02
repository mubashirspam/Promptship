import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technical Architecture',
  description: 'Complete technical architecture and system design for Promtify.',
};

export default function ArchitecturePage() {
  return (
    <div className="w-full min-h-screen">
      <iframe
        src="/docs/promptship-technical-architecture.html"
        className="w-full min-h-screen border-none"
        title="Promtify Technical Architecture"
      />
    </div>
  );
}
