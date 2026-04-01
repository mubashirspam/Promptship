'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Edit,
  Trash2,
  MoreVertical,
  Search,
  Eye,
  EyeOff,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Prompt {
  id: string;
  title: string;
  slug: string;
  tier: 'free' | 'starter' | 'pro' | 'team';
  frameworks: string[];
  categoryName: string | null;
  usageCount: number;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: Date;
}

const tierColors = {
  free: 'bg-emerald-500/10 text-emerald-500',
  starter: 'bg-blue-500/10 text-blue-500',
  pro: 'bg-purple-500/10 text-purple-500',
  team: 'bg-amber-500/10 text-amber-500',
};

export function PromptsTable({ prompts }: { prompts: Prompt[] }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const router = useRouter();

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(search.toLowerCase()) ||
      prompt.slug.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      (filter === 'published' && prompt.isPublished) ||
      (filter === 'draft' && !prompt.isPublished);

    return matchesSearch && matchesFilter;
  });

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/prompts/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');

      toast.success('Prompt deleted');
      router.refresh();
    } catch {
      toast.error('Failed to delete prompt');
    }
  }

  async function togglePublish(id: string, isPublished: boolean) {
    try {
      const res = await fetch(`/api/admin/prompts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !isPublished }),
      });

      if (!res.ok) throw new Error('Failed to update');

      toast.success(isPublished ? 'Unpublished' : 'Published');
      router.refresh();
    } catch {
      toast.error('Failed to update prompt');
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'published' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('published')}
          >
            Published
          </Button>
          <Button
            variant={filter === 'draft' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('draft')}
          >
            Draft
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Frameworks</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrompts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">No prompts found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredPrompts.map((prompt) => (
                <TableRow key={prompt.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {prompt.isFeatured && (
                        <Star className="size-4 fill-amber-500 text-amber-500" />
                      )}
                      <span className="font-medium">{prompt.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {prompt.categoryName || 'Uncategorized'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn('border-0', tierColors[prompt.tier])}>
                      {prompt.tier.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {prompt.frameworks.slice(0, 3).map((fw) => (
                        <Badge key={fw} variant="secondary" className="text-xs">
                          {fw}
                        </Badge>
                      ))}
                      {prompt.frameworks.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{prompt.frameworks.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{prompt.usageCount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={prompt.isPublished ? 'default' : 'secondary'}
                    >
                      {prompt.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/prompts/${prompt.id}/edit`}>
                            <Edit className="size-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            togglePublish(prompt.id, prompt.isPublished)
                          }
                        >
                          {prompt.isPublished ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                          {prompt.isPublished ? 'Unpublish' : 'Publish'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(prompt.id, prompt.title)}
                          className="text-destructive"
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filteredPrompts.length} of {prompts.length} prompts
      </p>
    </div>
  );
}
