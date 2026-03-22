'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Prompt } from './prompt-card';

const tierColors: Record<Prompt['tier'], string> = {
  free: 'bg-emerald-500/10 text-emerald-500',
  starter: 'bg-blue-500/10 text-blue-500',
  pro: 'bg-purple-500/10 text-purple-500',
  team: 'bg-amber-500/10 text-amber-500',
};

const frameworkColors: Record<string, string> = {
  react: '#61DAFB',
  flutter: '#02569B',
  html: '#E34F26',
  vue: '#4FC08D',
};

const gradientPlaceholders = [
  'from-violet-500 to-purple-500',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-red-500',
  'from-pink-500 to-rose-500',
  'from-indigo-500 to-blue-500',
];

function getGradient(id: string) {
  const index =
    id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    gradientPlaceholders.length;
  return gradientPlaceholders[index];
}

interface PromptModalProps {
  prompt: Prompt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PromptModal({ prompt, open, onOpenChange }: PromptModalProps) {
  const [copied, setCopied] = useState(false);

  if (!prompt) return null;

  async function handleCopy() {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopied(true);
      toast.success('Prompt copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy prompt');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {/* Preview image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
          {prompt.previewImageUrl ? (
            <img
              src={prompt.previewImageUrl}
              alt={prompt.title}
              className="size-full object-cover"
            />
          ) : (
            <div
              className={cn(
                'flex size-full items-center justify-center bg-gradient-to-br',
                getGradient(prompt.id)
              )}
            >
              <Sparkles className="size-10 text-white/60" />
            </div>
          )}
        </div>

        <DialogHeader>
          <DialogTitle>{prompt.title}</DialogTitle>
          {prompt.description && (
            <DialogDescription>{prompt.description}</DialogDescription>
          )}
        </DialogHeader>

        {/* Badges: category, tier, frameworks */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline">{prompt.categoryName}</Badge>
          <Badge
            variant="secondary"
            className={cn('border-0 uppercase', tierColors[prompt.tier])}
          >
            {prompt.tier}
          </Badge>
          {prompt.frameworks.map((fw) => (
            <Badge key={fw} variant="secondary" className="gap-1.5">
              <span
                className="size-2 rounded-full"
                style={{
                  backgroundColor: frameworkColors[fw] ?? '#888',
                }}
              />
              {fw.charAt(0).toUpperCase() + fw.slice(1)}
            </Badge>
          ))}
        </div>

        {/* Prompt text code block */}
        <div className="relative max-h-64 overflow-auto rounded-lg bg-muted p-3">
          <Button
            variant="ghost"
            size="icon-xs"
            className="absolute top-2 right-2"
            onClick={handleCopy}
            aria-label="Copy prompt text"
          >
            {copied ? (
              <Check className="size-3.5" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </Button>
          <pre className="whitespace-pre-wrap pr-8 text-sm leading-relaxed">
            <code>{prompt.promptText}</code>
          </pre>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="size-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="size-4" />
                Copy Prompt
              </>
            )}
          </Button>
          <Button asChild>
            <Link href={`/generate?promptId=${prompt.id}`}>
              <Sparkles className="size-4" />
              Generate with AI
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
