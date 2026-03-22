'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { STYLES, ANIMATION_LEVELS } from '@/lib/utils/constants';
import type { Style, AnimationLevel } from '@/lib/utils/constants';

interface StyleOptionsProps {
  style: Style;
  onStyleChange: (style: Style) => void;
  animationLevel: AnimationLevel;
  onAnimationChange: (level: AnimationLevel) => void;
}

export function StyleOptions({
  style,
  onStyleChange,
  animationLevel,
  onAnimationChange,
}: StyleOptionsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>Style</Label>
        <Select value={style} onValueChange={(v) => onStyleChange(v as Style)}>
          <SelectTrigger className="mt-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STYLES.map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Animation</Label>
        <Select
          value={animationLevel}
          onValueChange={(v) => onAnimationChange(v as AnimationLevel)}
        >
          <SelectTrigger className="mt-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ANIMATION_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
