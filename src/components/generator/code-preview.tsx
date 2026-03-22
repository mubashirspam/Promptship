'use client';

import { useState } from 'react';
import { useGeneratorStore } from '@/stores/generator-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Copy,
  Check,
  Download,
  RotateCcw,
  Code2,
  Eye,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export function CodePreview() {
  const { generatedCode, previewHtml, tokensUsed, latencyMs, status, framework, generate, reset } =
    useGeneratorStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!generatedCode) return;
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedCode) return;
    const extensions: Record<string, string> = {
      react: 'tsx',
      flutter: 'dart',
      html: 'html',
      vue: 'vue',
    };
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `component.${extensions[framework] || 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('File downloaded');
  };

  const handleRegenerate = () => {
    generate();
  };

  const formatLatency = (ms: number) => {
    return (ms / 1000).toFixed(1);
  };

  const addLineNumbers = (code: string) => {
    return code.split('\n').map((line, i) => (
      <div key={i} className="flex">
        <span className="inline-block w-10 shrink-0 pr-4 text-right text-muted-foreground/50 select-none">
          {i + 1}
        </span>
        <span className="flex-1">{line || ' '}</span>
      </div>
    ));
  };

  // Empty state
  if (!generatedCode) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] rounded-xl border border-dashed border-muted-foreground/25 bg-muted/30">
        <div className="flex flex-col items-center gap-4 text-center px-6">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-500/20">
            <Code2 className="size-8 text-purple-500" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold">No code generated yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Configure your component settings and click &quot;Generate Code&quot; to get started.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      <Tabs defaultValue="preview" className="flex flex-col flex-1">
        <TabsList>
          <TabsTrigger value="preview">
            <Eye className="size-3.5" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="code">
            <Code2 className="size-3.5" />
            Code
          </TabsTrigger>
        </TabsList>

        {/* Preview Tab */}
        <TabsContent value="preview" className="flex-1 mt-4">
          <div
            className={cn(
              'h-full min-h-[400px] rounded-xl flex items-center justify-center',
              'bg-gradient-to-br from-purple-600/20 via-violet-600/10 to-cyan-500/20',
              'border border-muted-foreground/10'
            )}
          >
            {previewHtml ? (
              <div
                className="w-full h-full p-6"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-center px-6">
                <Sparkles className="size-10 text-purple-400" />
                <div className="space-y-1">
                  <p className="font-medium">Preview Generated</p>
                  <p className="text-sm text-muted-foreground">
                    Switch to the Code tab to view and copy your generated code.
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Code Tab */}
        <TabsContent value="code" className="flex-1 mt-4">
          <pre className="overflow-auto rounded-xl bg-zinc-950 p-4 text-sm font-mono max-h-[500px] scrollbar-thin text-zinc-100">
            <code>{addLineNumbers(generatedCode)}</code>
          </pre>
        </TabsContent>
      </Tabs>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <div className="text-xs text-muted-foreground">
          Generated in {formatLatency(latencyMs)}s &bull; {tokensUsed.toLocaleString()} tokens
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={status === 'generating'}>
            <RotateCcw className="size-3.5" />
            Regenerate
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? 'Copied' : 'Copy Code'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="size-3.5" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
