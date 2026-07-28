'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MarkdownEditor } from '@/components/admin/markdown-editor';
import { Loader2, Upload, FileArchive } from 'lucide-react';
import {
  FRAMEWORKS,
  FRAMEWORK_META,
  PLATFORMS,
  PLATFORM_LABELS,
} from '@/lib/utils/constants';
import { uploadAdminFile, type UploadKind } from '@/lib/upload-client';

interface PromptFormProps {
  categories: { id: string; name: string; slug: string; parentId?: string | null }[];
  initialData?: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    promptText: string;
    categoryId: string | null;
    frameworks: string[] | null;
    previewImageUrl: string | null;
    previewVideoUrl?: string | null;
    assetKind?: string | null;
    templateType?: string | null;
    platform?: string | null;
    isFree?: boolean | null;
    assetUrl?: string | null;
    isFeatured: boolean | null;
    isPublished: boolean | null;
  };
}

const ASSET_KINDS = [
  { value: 'ai_prompt', label: 'AI Prompt (markdown)' },
  { value: 'figma', label: 'Figma Kit (file link)' },
  { value: 'code', label: 'Code Starter (zip)' },
];

/** Scope labels adapt to the selected kind. */
const SCOPE_LABELS: Record<string, { full: string; component: string }> = {
  ai_prompt: { full: 'Full page/site prompt', component: 'Component prompt' },
  figma: { full: 'Full website/app kit', component: 'Single component/section' },
  code: { full: 'Full website template', component: 'Component / section' },
};

export function PromptForm({ categories, initialData }: PromptFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [promptText, setPromptText] = useState(initialData?.promptText ?? '');
  // Radix Select forbids empty-string item values — 'none' = uncategorized
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? 'none');
  const [frameworks, setFrameworks] = useState<string[]>(initialData?.frameworks ?? ['react']);
  const [previewImageUrl, setPreviewImageUrl] = useState(initialData?.previewImageUrl ?? '');
  const [previewVideoUrl, setPreviewVideoUrl] = useState(initialData?.previewVideoUrl ?? '');
  const [assetKind, setAssetKind] = useState(initialData?.assetKind ?? 'ai_prompt');
  const [templateType, setTemplateType] = useState(
    initialData?.templateType === 'full' ? 'full' : 'component'
  );
  const [platform, setPlatform] = useState(initialData?.platform ?? 'web');
  const [isFree, setIsFree] = useState(initialData?.isFree ?? false);
  const [assetUrl, setAssetUrl] = useState(initialData?.assetUrl ?? '');
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);

  const [uploadingKind, setUploadingKind] = useState<UploadKind | null>(null);
  const [uploadPercent, setUploadPercent] = useState(0);

  // Direct browser→CDN upload (R2 primary, Blob fallback) — never through
  // the server, so large videos/zips work in production too
  async function handleUpload(file: File, kind: UploadKind, setUrl: (u: string) => void) {
    setUploadingKind(kind);
    setUploadPercent(0);
    setError('');
    try {
      const url = await uploadAdminFile(file, kind, (p) => setUploadPercent(Math.round(p)));
      setUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploadingKind(null);
    }
  }

  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEditing) {
      setSlug(generateSlug(value));
    }
  }

  function toggleFramework(fw: string) {
    setFrameworks((prev) =>
      prev.includes(fw) ? prev.filter((f) => f !== fw) : [...prev, fw]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (assetKind === 'figma' && !isFree && !assetUrl) {
      setError('Figma Kits need the Figma file link (that is what buyers receive)');
      setLoading(false);
      return;
    }
    if (assetKind === 'code' && !isFree && !assetUrl) {
      setError('Code Starters need a zip upload (that is what buyers download)');
      setLoading(false);
      return;
    }

    const payload = {
      title,
      slug,
      description: description || null,
      promptText,
      categoryId: categoryId === 'none' ? null : categoryId,
      frameworks,
      previewImageUrl: previewImageUrl || null,
      previewVideoUrl: previewVideoUrl || null,
      assetKind,
      templateType,
      platform,
      isFree,
      assetUrl: assetUrl || null,
      isFeatured,
      isPublished,
    };

    try {
      const url = isEditing
        ? `/api/admin/prompts/${initialData.id}`
        : '/api/admin/prompts';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) {
        setError(json.error?.message || 'Something went wrong');
        setLoading(false);
        return;
      }

      router.push('/templates');
      router.refresh();
    } catch {
      setError('Network error');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-6 pt-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="SaaS Hero Section"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="saas-hero-section"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of the prompt"
            />
          </div>

          {/* Template kind + access */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Template kind *</Label>
              <Select value={assetKind} onValueChange={setAssetKind}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSET_KINDS.map((k) => (
                    <SelectItem key={k.value} value={k.value}>
                      {k.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Decides which plan unlocks it (Basic=Figma, Pro=+AI prompts, Premium=+Code)
              </p>
            </div>
            <div className="space-y-2">
              <Label>Scope *</Label>
              <Select value={templateType} onValueChange={setTemplateType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">
                    {SCOPE_LABELS[assetKind]?.full ?? 'Full template'}
                  </SelectItem>
                  <SelectItem value="component">
                    {SCOPE_LABELS[assetKind]?.component ?? 'Component'}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Full = complete website/app · Component = single section
              </p>
            </div>
            <div className="space-y-2">
              <Label>Platform *</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {PLATFORM_LABELS[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Access</Label>
            <div className="flex h-9 items-center gap-2">
              <Switch id="isFree" checked={isFree} onCheckedChange={setIsFree} />
              <Label htmlFor="isFree" className="font-normal">
                {isFree ? 'Free — everyone can use it' : 'Paid — plan or purchase required'}
              </Label>
            </div>
          </div>

          {/* Per-kind asset: the thing buyers actually receive */}
          {assetKind === 'figma' && (
            <div className="space-y-2">
              <Label htmlFor="figma-url">
                Figma file link {isFree ? '' : '*'}
              </Label>
              <Input
                id="figma-url"
                value={assetUrl}
                onChange={(e) => setAssetUrl(e.target.value)}
                placeholder="https://www.figma.com/design/…"
              />
              <p className="text-xs text-muted-foreground">
                Only revealed to buyers via the gated download endpoint — never in the public page.
              </p>
            </div>
          )}
          {assetKind === 'code' && (
            <div className="space-y-2">
              <Label>Code zip {isFree ? '' : '*'}</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploadingKind !== null}
                  onClick={() => document.getElementById('zip-input')?.click()}
                >
                  {uploadingKind === 'asset' ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {uploadPercent}%
                    </>
                  ) : (
                    <>
                      <Upload className="size-4" />
                      {assetUrl ? 'Replace zip' : 'Upload zip'}
                    </>
                  )}
                </Button>
                <input
                  id="zip-input"
                  type="file"
                  accept=".zip"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f, 'asset', setAssetUrl);
                    e.target.value = '';
                  }}
                />
                {assetUrl && (
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <FileArchive className="size-4" />
                    {assetUrl.split('/').pop()}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Stored privately; buyers get it only through the gated download endpoint.
              </p>
            </div>
          )}

          <MarkdownEditor
            label={
              assetKind === 'ai_prompt'
                ? 'Prompt Content (Markdown) * — this is the paid content'
                : 'Description / Instructions (Markdown) * — shown to buyers alongside the asset'
            }
            value={promptText}
            onChange={setPromptText}
            placeholder="Write the full prompt content in Markdown..."
            minHeight="400px"
          />

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Uncategorized</SelectItem>
                  {categories
                    .filter((c) => !c.parentId)
                    .flatMap((parent) => [
                      parent,
                      ...categories.filter((c) => c.parentId === parent.id),
                    ])
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.parentId ? `  └ ${c.name}` : c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Preview Image</Label>
              <div className="flex gap-2">
                <Input
                  value={previewImageUrl}
                  onChange={(e) => setPreviewImageUrl(e.target.value)}
                  placeholder="Upload → or paste URL"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  disabled={uploadingKind !== null}
                  onClick={() => document.getElementById('preview-image-input')?.click()}
                  aria-label="Upload preview image"
                >
                  {uploadingKind === 'image' ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Upload className="size-4" />
                  )}
                </Button>
                <input
                  id="preview-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f, 'image', setPreviewImageUrl);
                    e.target.value = '';
                  }}
                />
              </div>
              {previewImageUrl && (
                <img
                  src={previewImageUrl}
                  alt="preview"
                  className="h-16 rounded-md border object-cover"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preview Video</Label>
            <div className="flex gap-2">
              <Input
                value={previewVideoUrl}
                onChange={(e) => setPreviewVideoUrl(e.target.value)}
                placeholder="Upload → or paste URL (.mp4/.webm — autoplays on cards)"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0"
                disabled={uploadingKind !== null}
                onClick={() => document.getElementById('preview-video-input')?.click()}
                aria-label="Upload preview video"
              >
                {uploadingKind === 'video' ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
              </Button>
              <input
                id="preview-video-input"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload(f, 'video', setPreviewVideoUrl);
                  e.target.value = '';
                }}
              />
            </div>
            {uploadingKind === 'video' && (
              <p className="text-xs text-muted-foreground">Uploading… {uploadPercent}%</p>
            )}
            {previewVideoUrl && uploadingKind !== 'video' && (
              <video src={previewVideoUrl} muted loop autoPlay playsInline className="h-20 rounded-md border" />
            )}
          </div>

          {assetKind !== 'figma' && (
            <div className="space-y-2">
              <Label>Frameworks / stacks</Label>
              <div className="flex flex-wrap gap-2">
                {FRAMEWORKS.map((fw) => (
                  <Button
                    key={fw}
                    type="button"
                    size="sm"
                    variant={frameworks.includes(fw) ? 'default' : 'outline'}
                    onClick={() => toggleFramework(fw)}
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: FRAMEWORK_META[fw].color }}
                    />
                    {FRAMEWORK_META[fw].label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="featured"
                checked={isFeatured}
                onCheckedChange={setIsFeatured}
              />
              <Label htmlFor="featured">Featured</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="published"
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
              <Label htmlFor="published">Published</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/templates')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="size-4 mr-1 animate-spin" />}
              {isEditing ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
