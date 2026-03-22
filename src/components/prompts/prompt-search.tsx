'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PromptSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function PromptSearch({
  value,
  onChange,
  placeholder = 'Search prompts...',
  debounceMs = 300,
  className,
}: PromptSearchProps) {
  const [internalValue, setInternalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Sync external value changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const debouncedOnChange = useCallback(
    (newValue: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        onChange(newValue);
      }, debounceMs);
    },
    [onChange, debounceMs]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setInternalValue(newValue);
    debouncedOnChange(newValue);
  }

  function handleClear() {
    setInternalValue('');
    onChange('');
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }

  return (
    <div className={cn('relative w-full sm:max-w-xs', className)}>
      <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />
      {internalValue && (
        <Button
          variant="ghost"
          size="icon-xs"
          className="absolute right-1.5 top-1/2 -translate-y-1/2"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
