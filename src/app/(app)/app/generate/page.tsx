import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import { ComingSoon } from '@/components/shared/coming-soon';

export const metadata: Metadata = {
  title: 'AI Generator',
};

export default function GeneratePage() {
  return (
    <ComingSoon
      icon={Sparkles}
      title="AI Code Generator"
      description="Turn any prompt into production-ready UI code in seconds. We're putting the finishing touches on it."
      highlights={[
        'Generate React, Flutter, HTML & Vue components',
        'Start from any prompt in your library',
        'Live preview and one-click copy',
      ]}
    />
  );
}
