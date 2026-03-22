'use client';

import { useMutation } from '@tanstack/react-query';
import type { GenerateInput } from '@/lib/validations/generator';
import type { GenerateResponse } from '@/types/api';

export function useGenerator() {
  return useMutation<GenerateResponse, Error, GenerateInput>({
    mutationFn: async (input) => {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || 'Generation failed');
      }
      const data = await res.json();
      return data.data;
    },
  });
}
