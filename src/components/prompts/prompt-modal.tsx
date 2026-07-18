'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, Sparkles, Lock, Loader2, Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
import { assetKindLabels } from './prompt-card';
import { openTemplateFigma, downloadTemplateZip } from '@/lib/template-asset';

import { FRAMEWORK_META, PLATFORM_LABELS, type Framework, type Platform } from '@/lib/utils/constants';

const frameworkColor = (fw: string) =>
  FRAMEWORK_META[fw as Framework]?.color ?? '#888';

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

function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return (
    url.includes('.mp4') ||
    url.includes('.webm') ||
    url.includes('.m3u8') ||
    url.includes('stream.mux.com') ||
    url.includes('cloudfront.net')
  );
}

interface PromptModalProps {
  prompt: Prompt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PromptModal({ prompt, open, onOpenChange }: PromptModalProps) {
  const [copied, setCopied] = useState(false);
  const [fetchingAsset, setFetchingAsset] = useState(false);

  if (!prompt) return null;

  const locked = prompt.hasAccess === false;
  const kind = prompt.assetKind ?? 'ai_prompt';

  async function handleCopy() {
    if (!prompt?.promptText) return;
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopied(true);
      toast.success('Prompt copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy prompt');
    }
  }

  // Figma links and code zips are never in the page payload — fetched per
  // click from the entitlement-gated download endpoint (lib/template-asset)
  async function openFigma() {
    if (!prompt) return;
    setFetchingAsset(true);
    try {
      await openTemplateFigma(prompt.id);
    } finally {
      setFetchingAsset(false);
    }
  }

  async function downloadZip() {
    if (!prompt) return;
    setFetchingAsset(true);
    try {
      await downloadTemplateZip(prompt.id);
    } finally {
      setFetchingAsset(false);
    }
  }

  const mediaSrc = prompt.previewVideoUrl || prompt.previewImageUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {/* Preview media */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
          {mediaSrc ? (
            isVideoUrl(mediaSrc) ? (
              <video
                src={mediaSrc}
                autoPlay
                loop
                muted
                playsInline
                className="size-full object-cover"
              />
            ) : (
              <img
                src={mediaSrc}
                alt={prompt.title}
                className="size-full object-cover"
              />
            )
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

        {/* Badges: kind, category, access, frameworks */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge className="border-0 bg-violet-500/10 text-violet-500">
            {assetKindLabels[kind] ?? kind}
          </Badge>
          {prompt.templateType && (
            <Badge className="border-0 bg-cyan-500/10 text-cyan-500">
              {prompt.templateType === 'full'
                ? prompt.platform === 'mobile'
                  ? 'Full app'
                  : 'Full site'
                : 'Component'}
            </Badge>
          )}
          {prompt.platform && (
            <Badge variant="outline">
              {PLATFORM_LABELS[prompt.platform as Platform] ?? prompt.platform}
            </Badge>
          )}
          <Badge variant="outline">{prompt.categoryName}</Badge>
          {prompt.isFree ? (
            <Badge className="border-0 bg-emerald-500/10 text-emerald-500">FREE</Badge>
          ) : locked ? (
            <Badge className="border-0 bg-amber-500/10 text-amber-500">
              <Lock className="size-3" /> PAID
            </Badge>
          ) : (
            <Badge className="border-0 bg-emerald-500/10 text-emerald-500">OWNED</Badge>
          )}
          {kind !== 'figma' &&
            prompt.frameworks.map((fw) => (
              <Badge key={fw} variant="secondary" className="gap-1.5">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: frameworkColor(fw) }}
                />
                {FRAMEWORK_META[fw as Framework]?.label ?? fw}
              </Badge>
            ))}
        </div>

        {/* Content — markdown-rendered; locked users get the CTA panel */}
        {locked ? (
          <div className="flex flex-col items-center gap-3 rounded-lg bg-muted p-6 text-center">
            <Lock className="size-6 text-amber-500" />
            <p className="text-sm text-muted-foreground">
              {kind === 'figma' &&
                'This Figma Kit is included in the Basic plan (or buy it alone). Unlock to get the Figma file link.'}
              {kind === 'code' &&
                'This Code Starter is included in the Premium plan (or buy it alone). Unlock to download the source zip.'}
              {kind === 'ai_prompt' &&
                'This AI Prompt is included in the Pro plan (or buy it alone). Unlock to copy the full prompt.'}
            </p>
          </div>
        ) : (
          prompt.promptText && (
            <div className="relative max-h-80 overflow-auto rounded-lg bg-muted p-4">
              <Button
                variant="ghost"
                size="icon-xs"
                className="absolute top-2 right-2 z-10"
                onClick={handleCopy}
                aria-label="Copy prompt text"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              </Button>
              <div className="prose prose-sm dark:prose-invert max-w-none [&_pre]:overflow-x-auto">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {prompt.promptText}
                </ReactMarkdown>
              </div>
            </div>
          )
        )}

        <DialogFooter className="flex-wrap">
          {locked ? (
            <Button asChild>
              <Link href={`/upgrade?product=template:${prompt.id}`}>
                <Lock className="size-4" />
                Get Access
              </Link>
            </Button>
          ) : (
            <>
              {kind === 'ai_prompt' && (
                <>
                  <Button variant="outline" onClick={handleCopy}>
                    {copied ? (
                      <>
                        <Check className="size-4" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="size-4" /> Copy Prompt
                      </>
                    )}
                  </Button>
                  <Button asChild>
                    <Link href={`/generate?promptId=${prompt.id}`}>
                      <Sparkles className="size-4" />
                      Generate with AI
                    </Link>
                  </Button>
                </>
              )}
              {kind !== 'ai_prompt' && prompt.promptText && (
                <Button variant="outline" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <Check className="size-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" /> Copy Prompt
                    </>
                  )}
                </Button>
              )}
              {kind === 'figma' && (
                <Button onClick={openFigma} disabled={fetchingAsset}>
                  {fetchingAsset ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ExternalLink className="size-4" />
                  )}
                  Open in Figma
                </Button>
              )}
              {kind === 'code' && (
                <Button onClick={downloadZip} disabled={fetchingAsset}>
                  {fetchingAsset ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Download className="size-4" />
                  )}
                  Download ZIP
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
