'use client';

import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Bold,
  Italic,
  Heading2,
  List,
  Link as LinkIcon,
  Code,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { uploadAdminFile } from '@/lib/upload-client';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your content in Markdown...',
  minHeight = '300px',
  label,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<string>('write');
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** Insert text at the cursor (or wrap the current selection). */
  function insertAtCursor(before: string, after = '', placeholderText = '') {
    const el = textareaRef.current;
    if (!el) {
      onChange(value + before + placeholderText + after);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || placeholderText;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    // restore focus + selection after react re-render
    requestAnimationFrame(() => {
      el.focus();
      const cursor = start + before.length + selected.length;
      el.setSelectionRange(cursor, cursor);
    });
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const url = await uploadAdminFile(file, 'image');
      const alt = file.name.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]/g, ' ');
      insertAtCursor(`\n![${alt}](${url})\n`);
      toast.success('Image uploaded and inserted');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Image upload failed');
    } finally {
      setUploading(false);
    }
  }

  const tools = [
    { icon: Bold, label: 'Bold', action: () => insertAtCursor('**', '**', 'bold text') },
    { icon: Italic, label: 'Italic', action: () => insertAtCursor('*', '*', 'italic text') },
    { icon: Heading2, label: 'Heading', action: () => insertAtCursor('\n## ', '', 'Heading') },
    { icon: List, label: 'List', action: () => insertAtCursor('\n- ', '', 'List item') },
    { icon: LinkIcon, label: 'Link', action: () => insertAtCursor('[', '](https://)', 'link text') },
    { icon: Code, label: 'Code block', action: () => insertAtCursor('\n```\n', '\n```\n', 'code') },
  ];

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none">{label}</label>
      )}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TabsList className="justify-start">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          {/* Formatting toolbar — visible while writing */}
          {activeTab === 'write' && (
            <div className="flex items-center gap-0.5">
              {tools.map((tool) => (
                <Button
                  key={tool.label}
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  title={tool.label}
                  aria-label={tool.label}
                  onClick={tool.action}
                >
                  <tool.icon className="size-4" />
                </Button>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                title="Insert image (uploads to CDN)"
                aria-label="Insert image"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ImageIcon className="size-4" />
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = '';
                  if (f) handleImageUpload(f);
                }}
              />
            </div>
          )}
        </div>

        <TabsContent value="write" className="mt-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              'w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm',
              'ring-offset-background placeholder:text-muted-foreground',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
              'resize-y'
            )}
            style={{ minHeight }}
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-2">
          <div
            className={cn(
              'overflow-auto rounded-md border border-input bg-background px-4 py-3',
              'prose prose-sm dark:prose-invert max-w-none',
              'prose-img:rounded-lg prose-img:border'
            )}
            style={{ minHeight }}
          >
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <p className="text-sm text-muted-foreground">Nothing to preview</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
