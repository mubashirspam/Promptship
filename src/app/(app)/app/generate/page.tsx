import type { Metadata } from 'next';
import { GeneratorForm } from '@/components/generator/generator-form';
import { CodePreview } from '@/components/generator/code-preview';

export const metadata: Metadata = {
  title: 'AI Generator',
};

export default function GeneratePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Code Generator</h1>
        <p className="text-muted-foreground">
          Generate production-ready UI code from prompts.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        <div className="rounded-xl border bg-card p-5">
          <GeneratorForm />
        </div>
        <div className="rounded-xl border bg-card p-5">
          <CodePreview />
        </div>
      </div>
    </div>
  );
}
