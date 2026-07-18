'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Copy,
  Download,
  RotateCcw,
  Trash2,
  Clock,
  Code2,
  Inbox,
} from 'lucide-react';
import { toast } from 'sonner';

interface HistoryItem {
  id: string;
  title: string;
  framework: string;
  style: string;
  createdAt: string;
  tokensUsed: number;
  code: string;
  gradient: string;
}

const MOCK_HISTORY: HistoryItem[] = [
  {
    id: '1',
    title: 'Login Screen with Glassmorphism',
    framework: 'react',
    style: 'glassmorphism',
    createdAt: '2026-03-22T10:30:00Z',
    tokensUsed: 1247,
    code: '// React Login Component...',
    gradient: 'from-purple-600/30 to-violet-600/20',
  },
  {
    id: '2',
    title: 'Dashboard Layout with Stats',
    framework: 'vue',
    style: 'minimal',
    createdAt: '2026-03-21T15:45:00Z',
    tokensUsed: 2103,
    code: '<!-- Vue Dashboard Template -->',
    gradient: 'from-cyan-600/30 to-blue-600/20',
  },
  {
    id: '3',
    title: 'Pricing Table with Gradient',
    framework: 'html',
    style: 'gradient',
    createdAt: '2026-03-20T09:15:00Z',
    tokensUsed: 890,
    code: '<!-- HTML Pricing Table -->',
    gradient: 'from-orange-600/30 to-amber-600/20',
  },
  {
    id: '4',
    title: 'Hero Section with Animation',
    framework: 'react',
    style: 'bold',
    createdAt: '2026-03-19T14:20:00Z',
    tokensUsed: 1580,
    code: '// React Hero Component...',
    gradient: 'from-pink-600/30 to-rose-600/20',
  },
  {
    id: '5',
    title: 'Settings Page with Tabs',
    framework: 'flutter',
    style: 'neumorphism',
    createdAt: '2026-03-18T11:00:00Z',
    tokensUsed: 1920,
    code: '// Flutter Settings Widget...',
    gradient: 'from-green-600/30 to-emerald-600/20',
  },
  {
    id: '6',
    title: 'Profile Card with Avatar',
    framework: 'react',
    style: 'glassmorphism',
    createdAt: '2026-03-17T16:30:00Z',
    tokensUsed: 745,
    code: '// React Profile Card...',
    gradient: 'from-indigo-600/30 to-purple-600/20',
  },
];

const FRAMEWORK_FILTERS = ['all', 'react', 'flutter', 'html', 'vue'] as const;

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [frameworkFilter, setFrameworkFilter] = useState<string>('all');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [items, setItems] = useState<HistoryItem[]>(MOCK_HISTORY);

  const filtered = useMemo(() => {
    let result = [...items];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.framework.toLowerCase().includes(q)
      );
    }

    if (frameworkFilter !== 'all') {
      result = result.filter((item) => item.framework === frameworkFilter);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sort === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [items, search, frameworkFilter, sort]);

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const handleDownload = (item: HistoryItem) => {
    const extensions: Record<string, string> = {
      react: 'tsx',
      flutter: 'dart',
      html: 'html',
      vue: 'vue',
    };
    const blob = new Blob([item.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title.toLowerCase().replace(/\s+/g, '-')}.${extensions[item.framework] || 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('File downloaded');
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success('Generation deleted');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Generation History</h1>
          <p className="text-muted-foreground">
            View and manage your past AI generations.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search generations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5">
          {FRAMEWORK_FILTERS.map((fw) => (
            <button
              key={fw}
              type="button"
              onClick={() => setFrameworkFilter(fw)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                frameworkFilter === fw
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {fw === 'all' ? 'All' : fw}
            </button>
          ))}
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v as 'newest' | 'oldest')}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-muted mb-4">
            <Inbox className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No generations found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            {search || frameworkFilter !== 'all'
              ? 'Try adjusting your filters or search query.'
              : 'Start by generating your first component.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              {/* Gradient Preview */}
              <div
                className={cn(
                  'h-32 bg-gradient-to-br flex items-center justify-center',
                  item.gradient
                )}
              >
                <Code2 className="size-10 text-foreground/20" />
              </div>

              <CardContent className="space-y-3 pt-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-sm leading-tight line-clamp-2">
                    {item.title}
                  </h3>
                  <Badge variant="secondary" className="shrink-0 capitalize">
                    {item.framework}
                  </Badge>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  <span>{formatDate(item.createdAt)}</span>
                  <span className="text-muted-foreground/40">&bull;</span>
                  <span>{item.tokensUsed.toLocaleString()} tokens</span>
                </div>

                {/* Actions */}
                <div className="flex gap-1.5 pt-1">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleCopy(item.code)}
                    title="Copy code"
                  >
                    <Copy className="size-3" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleDownload(item)}
                    title="Download"
                  >
                    <Download className="size-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    title="Regenerate"
                  >
                    <RotateCcw className="size-3" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="xs"
                    onClick={() => handleDelete(item.id)}
                    title="Delete"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
