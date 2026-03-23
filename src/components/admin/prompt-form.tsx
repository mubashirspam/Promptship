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
import { Loader2 } from 'lucide-react';

interface PromptFormProps {
  categories: { id: string; name: string; slug: string }[];
  initialData?: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    promptText: string;
    categoryId: string | null;
    tier: string;
    frameworks: string[] | null;
    previewImageUrl: string | null;
    isFeatured: boolean | null;
    isPublished: boolean | null;
  };
}

const TIERS = ['free', 'starter', 'pro', 'team'];
const FRAMEWORKS = ['react', 'flutter', 'html', 'vue'];

export function PromptForm({ categories, initialData }: PromptFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [promptText, setPromptText] = useState(initialData?.promptText ?? '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? '');
  const [tier, setTier] = useState(initialData?.tier ?? 'free');
  const [frameworks, setFrameworks] = useState<string[]>(initialData?.frameworks ?? ['react']);
  const [previewImageUrl, setPreviewImageUrl] = useState(initialData?.previewImageUrl ?? '');
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);

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

    const payload = {
      title,
      slug,
      description: description || null,
      promptText,
      categoryId: categoryId || null,
      tier,
      frameworks,
      previewImageUrl: previewImageUrl || null,
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

      router.push('/prompts');
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

          <MarkdownEditor
            label="Prompt Text (Markdown) *"
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
                  <SelectItem value="">Uncategorized</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tier</Label>
              <Select value={tier} onValueChange={setTier}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIERS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Preview Image URL</Label>
              <Input
                value={previewImageUrl}
                onChange={(e) => setPreviewImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Frameworks</Label>
            <div className="flex flex-wrap gap-2">
              {FRAMEWORKS.map((fw) => (
                <Button
                  key={fw}
                  type="button"
                  size="sm"
                  variant={frameworks.includes(fw) ? 'default' : 'outline'}
                  onClick={() => toggleFramework(fw)}
                >
                  {fw}
                </Button>
              ))}
            </div>
          </div>

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
              onClick={() => router.push('/prompts')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="size-4 mr-1 animate-spin" />}
              {isEditing ? 'Update Prompt' : 'Create Prompt'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
