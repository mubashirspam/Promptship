'use client';

import { useState } from 'react';
import { Copy, Check, Sparkles, Heart, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface Prompt {
  id: string;
  title: string;
  description: string | null;
  promptText: string;
  tier: 'free' | 'starter' | 'pro' | 'team';
  frameworks: string[];
  categoryName: string;
  previewImageUrl: string | null;
  previewVideoUrl?: string | null; // Video/GIF preview support
  usageCount: number;
  isFeatured: boolean;
}

interface PromptCardProps {
  prompt: Prompt;
  onSelect?: (prompt: Prompt) => void;
  onGenerate?: (prompt: Prompt) => void;
  onFavorite?: (prompt: Prompt) => void;
  isFavorited?: boolean;
  className?: string;
}

const tierConfig: Record<
  Prompt['tier'],
  { label: string; className: string }
> = {
  free: { label: 'FREE', className: 'bg-emerald-500/10 text-emerald-500' },
  starter: {
    label: 'STARTER',
    className: 'bg-blue-500/10 text-blue-500',
  },
  pro: { label: 'PRO', className: 'bg-purple-500/10 text-purple-500' },
  team: { label: 'TEAM', className: 'bg-amber-500/10 text-amber-500' },
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

export function PromptCard({
  prompt,
  onSelect,
  onGenerate,
  onFavorite,
  isFavorited = false,
  className,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopied(true);
      toast.success('Prompt copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy prompt');
    }
  }

  function handleGenerate(e: React.MouseEvent) {
    e.stopPropagation();
    onGenerate?.(prompt);
  }

  function handleFavorite(e: React.MouseEvent) {
    e.stopPropagation();
    onFavorite?.(prompt);
  }

  const tier = tierConfig[prompt.tier];

  return (
    <Card
      className={cn(
        'group cursor-pointer transition-all hover:ring-2 hover:ring-primary/20',
        className
      )}
      onClick={() => onSelect?.(prompt)}
    >
      {/* Preview area with gradient */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-xl">
        {prompt.previewVideoUrl ? (
          <video
            src={prompt.previewVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="size-full object-cover transition-transform group-hover:scale-105"
            poster={prompt.previewImageUrl || undefined}
          />
        ) : prompt.previewImageUrl ? (
          <img
            src={prompt.previewImageUrl}
            alt={prompt.title}
            className="size-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div
            className={cn(
              'flex size-full items-center justify-center bg-gradient-to-br',
              getGradient(prompt.id)
            )}
          >
            <Sparkles className="size-8 text-white/60" />
          </div>
        )}

        {/* Tier badge - top right */}
        <Badge
          variant="secondary"
          className={cn('absolute top-2 right-2 border-0', tier.className)}
        >
          {prompt.tier !== 'free' && <Lock className="size-3" />}
          {tier.label}
        </Badge>

        {/* Generate button on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Button size="sm" onClick={handleGenerate}>
            <Sparkles className="size-3.5" />
            Generate
          </Button>
        </div>
      </div>

      {/* Content */}
      <CardContent className="flex flex-col gap-2">
        <h3 className="line-clamp-1 font-medium">{prompt.title}</h3>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {prompt.categoryName}
          </Badge>
          <div className="flex items-center gap-1">
            {prompt.frameworks.map((fw) => (
              <span
                key={fw}
                className="size-2.5 rounded-full"
                style={{
                  backgroundColor: frameworkColors[fw] ?? '#888',
                }}
                title={fw.charAt(0).toUpperCase() + fw.slice(1)}
              />
            ))}
          </div>
        </div>

        {prompt.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {prompt.description}
          </p>
        )}
      </CardContent>

      {/* Actions */}
      <CardFooter className="gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleFavorite}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={cn(
              'size-4',
              isFavorited && 'fill-red-500 text-red-500'
            )}
          />
        </Button>
      </CardFooter>
    </Card>
  );
}
