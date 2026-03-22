'use client';

import { useQuery } from '@tanstack/react-query';
import type { Prompt, Category } from '@/types/database';
import type { PaginatedResponse } from '@/types/api';

interface UsePromptsOptions {
  category?: string;
  framework?: string;
  tier?: string;
  sort?: string;
  query?: string;
  page?: number;
  pageSize?: number;
}

export function usePrompts(options: UsePromptsOptions = {}) {
  const params = new URLSearchParams();
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) params.set(key, String(value));
  });

  return useQuery<PaginatedResponse<Prompt>>({
    queryKey: ['prompts', options],
    queryFn: async () => {
      const res = await fetch(`/api/prompts?${params}`);
      if (!res.ok) throw new Error('Failed to fetch prompts');
      const data = await res.json();
      return data.data;
    },
  });
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      return data.data;
    },
  });
}
