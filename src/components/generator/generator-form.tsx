'use client';

import { useGeneratorStore } from '@/stores/generator-store';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sparkles, Loader2, CreditCard } from 'lucide-react';

const TEMPLATES = [
  { value: 'login-screen', label: 'Login Screen' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'pricing-table', label: 'Pricing Table' },
  { value: 'hero-section', label: 'Hero Section' },
  { value: 'profile-card', label: 'Profile Card' },
  { value: 'settings-page', label: 'Settings Page' },
];

const FRAMEWORKS = [
  { value: 'react', label: 'React' },
  { value: 'flutter', label: 'Flutter' },
  { value: 'html', label: 'HTML' },
  { value: 'vue', label: 'Vue' },
];

const STYLES = [
  { value: 'glassmorphism', label: 'Glassmorphism' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'bold', label: 'Bold' },
  { value: 'neumorphism', label: 'Neumorphism' },
];

const COLORS = [
  { value: '#7C3AED', label: 'Purple' },
  { value: '#06B6D4', label: 'Cyan' },
  { value: '#F97316', label: 'Orange' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#10B981', label: 'Green' },
];

const ANIMATION_LEVELS = [
  { value: 'none', label: 'None' },
  { value: 'subtle', label: 'Subtle' },
  { value: 'dynamic', label: 'Dynamic' },
];

export function GeneratorForm() {
  const store = useGeneratorStore();
  const { user } = useAuth();
  const credits = (user as Record<string, unknown>)?.credits as number ?? 0;
  const isGenerating = store.status === 'generating';

  return (
    <div className="space-y-5">
      {/* Template Select */}
      <div>
        <Label className="mb-1.5 block text-sm font-medium">Template</Label>
        <Select
          value={store.template}
          onValueChange={(v) => store.setField('template', v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            {TEMPLATES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Framework Selector */}
      <div>
        <Label className="mb-1.5 block text-sm font-medium">Framework</Label>
        <div className="grid grid-cols-4 gap-2">
          {FRAMEWORKS.map((fw) => (
            <button
              key={fw.value}
              type="button"
              onClick={() => store.setField('framework', fw.value)}
              className={cn(
                'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                store.framework === fw.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-input bg-background text-foreground hover:bg-muted'
              )}
            >
              {fw.label}
            </button>
          ))}
        </div>
      </div>

      {/* Style Select */}
      <div>
        <Label className="mb-1.5 block text-sm font-medium">Style</Label>
        <Select
          value={store.style}
          onValueChange={(v) => store.setField('style', v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a style" />
          </SelectTrigger>
          <SelectContent>
            {STYLES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Primary Color Swatches */}
      <div>
        <Label className="mb-1.5 block text-sm font-medium">Primary Color</Label>
        <div className="flex gap-3">
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              title={c.label}
              onClick={() => store.setField('primaryColor', c.value)}
              className={cn(
                'size-9 rounded-full transition-all',
                store.primaryColor === c.value
                  ? 'ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110'
                  : 'hover:scale-105'
              )}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor="dark-mode" className="text-sm font-medium">
          Dark Mode
        </Label>
        <Switch
          id="dark-mode"
          checked={store.darkMode}
          onCheckedChange={(v) => store.setField('darkMode', v)}
        />
      </div>

      {/* Animation Level */}
      <div>
        <Label className="mb-1.5 block text-sm font-medium">Animation Level</Label>
        <div className="grid grid-cols-3 gap-2">
          {ANIMATION_LEVELS.map((al) => (
            <button
              key={al.value}
              type="button"
              onClick={() => store.setField('animationLevel', al.value)}
              className={cn(
                'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                store.animationLevel === al.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-input bg-background text-foreground hover:bg-muted'
              )}
            >
              {al.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Instructions */}
      <div>
        <Label htmlFor="custom-instructions" className="mb-1.5 block text-sm font-medium">
          Custom Instructions
        </Label>
        <textarea
          id="custom-instructions"
          className="w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          placeholder="Any additional requirements or preferences..."
          value={store.customInstructions}
          onChange={(e) => store.setField('customInstructions', e.target.value)}
          maxLength={500}
        />
      </div>

      {/* Generate Button */}
      <Button
        onClick={() => store.generate()}
        disabled={isGenerating}
        className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 border-0"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles />
            Generate Code
          </>
        )}
      </Button>

      {/* Credits Display */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <CreditCard className="size-3" />
        <span>{credits} credits remaining</span>
      </div>
    </div>
  );
}
