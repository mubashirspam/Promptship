'use client';

import { useState } from 'react';
import { Copy, Check, Sparkles, Heart, Lock, Unlock, BadgeCheck, Download, ExternalLink, Loader2 } from 'lucide-react';
import { openTemplateFigma, downloadTemplateZip } from '@/lib/template-asset';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { FRAMEWORK_META, type Framework } from '@/lib/utils/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export type AssetKind = 'figma' | 'ai_prompt' | 'code';

export interface Prompt {
  id: string;
  title: string;
  description: string | null;
  /** null when the viewer has no access to this paid template */
  promptText: string | null;
  isFree?: boolean;
  hasAccess?: boolean;
  /** figma | ai_prompt | code — the template kind */
  assetKind?: AssetKind | string | null;
  /** full = complete website/app · component = single section */
  templateType?: 'full' | 'component' | string | null;
  /** web | mobile | universal */
  platform?: string | null;
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

export const assetKindLabels: Record<string, string> = {
  figma: 'Figma Kit',
  ai_prompt: 'AI Prompt',
  code: 'Code Starter',
};

const frameworkColor = (fw: string) =>
  FRAMEWORK_META[fw as Framework]?.color ?? '#888';

function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return (
    url.includes(".mp4") ||
    url.includes(".webm") ||
    url.includes(".m3u8") ||
    url.includes(".ogv") ||
    url.includes("stream.mux.com") ||
    url.includes("cloudfront.net")
  );
}

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
  const [fetchingAsset, setFetchingAsset] = useState(false);

  const locked = prompt.hasAccess === false;
  const kind = prompt.assetKind ?? 'ai_prompt';

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    if (!prompt.promptText) return;
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopied(true);
      toast.success('Prompt copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy prompt');
    }
  }

  function handleUnlock(e: React.MouseEvent) {
    e.stopPropagation();
    window.location.href = `/upgrade?product=template:${prompt.id}`;
  }

  async function handleAsset(e: React.MouseEvent) {
    e.stopPropagation();
    setFetchingAsset(true);
    try {
      if (kind === 'figma') await openTemplateFigma(prompt.id);
      else await downloadTemplateZip(prompt.id);
    } finally {
      setFetchingAsset(false);
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

  return (
    <Card
      className={cn(
        'group cursor-pointer transition-all hover:ring-2 hover:ring-primary/20',
        className
      )}
      onClick={() => onSelect?.(prompt)}
    >
      {/* Preview area */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-xl">
        {(() => {
          // Pick best media source — both fields can hold video URLs
          const mediaSrc = prompt.previewVideoUrl || prompt.previewImageUrl;
          if (!mediaSrc) {
            return (
              <div
                className={cn(
                  'flex size-full items-center justify-center bg-gradient-to-br',
                  getGradient(prompt.id)
                )}
              >
                <Sparkles className="size-8 text-white/60" />
              </div>
            );
          }
          if (isVideoUrl(mediaSrc)) {
            return (
              <video
                src={mediaSrc}
                autoPlay
                loop
                muted
                playsInline
                className="size-full object-cover transition-transform group-hover:scale-105"
              />
            );
          }
          return (
            <img
              src={mediaSrc}
              alt={prompt.title}
              className="size-full object-cover transition-transform group-hover:scale-105"
            />
          );
        })()}

        {/* Access chip — glass effect, top right */}
        <div className="absolute top-2.5 right-2.5">
          {prompt.isFree ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white shadow-sm ring-1 ring-white/25 backdrop-blur-md">
              <Unlock className="size-3 text-emerald-400" />
              Free
            </span>
          ) : locked ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1 text-[11px] font-semibold text-white shadow-sm ring-1 ring-white/20 backdrop-blur-md">
              <Lock className="size-3 text-amber-400" />
              Locked
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white shadow-sm ring-1 ring-white/25 backdrop-blur-md">
              <BadgeCheck className="size-3 text-emerald-400" />
              Owned
            </span>
          )}
        </div>

        {/* Generate on hover — only meaningful for unlocked AI prompts */}
        {kind === 'ai_prompt' && !locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Button size="sm" onClick={handleGenerate}>
              <Sparkles className="size-3.5" />
              Generate
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="flex flex-col gap-2">
        <h3 className="line-clamp-1 font-medium">{prompt.title}</h3>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className="text-xs">
            {prompt.categoryName}
          </Badge>
          {prompt.templateType && (
            <Badge
              variant="secondary"
              className={cn(
                'border-0 text-xs',
                prompt.templateType === 'full'
                  ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                  : 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
              )}
            >
              {prompt.templateType === 'full'
                ? prompt.platform === 'mobile'
                  ? 'Full app'
                  : 'Full site'
                : 'Component'}
            </Badge>
          )}
          <div className="ml-auto flex items-center gap-1">
            {prompt.frameworks.map((fw) => (
              <span
                key={fw}
                className="size-2.5 rounded-full"
                style={{
                  backgroundColor: frameworkColor(fw),
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

      {/* Actions — per kind; locked templates get an Unlock CTA only */}
      <CardFooter className="gap-2">
        {locked ? (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-amber-500/40 text-amber-600 hover:bg-amber-500/10 dark:text-amber-500"
            onClick={handleUnlock}
          >
            <Lock className="size-3.5" />
            Unlock
          </Button>
        ) : (
          <>
            {/* Figma Kits open the file link; Code Starters download the zip */}
            {(kind === 'figma' || kind === 'code') && (
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                disabled={fetchingAsset}
                onClick={handleAsset}
              >
                {fetchingAsset ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : kind === 'figma' ? (
                  <>
                    <ExternalLink className="size-3.5" />
                    Figma
                  </>
                ) : (
                  <>
                    <Download className="size-3.5" />
                    Download
                  </>
                )}
              </Button>
            )}
            {/* Copy prompt whenever prompt content exists */}
            {prompt.promptText && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="size-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    Copy
                  </>
                )}
              </Button>
            )}
          </>
        )}
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
