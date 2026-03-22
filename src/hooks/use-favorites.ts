'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useFavorites() {
  const queryClient = useQueryClient();

  const favorites = useQuery<string[]>({
    queryKey: ['favorites'],
    queryFn: async () => {
      const res = await fetch('/api/favorites');
      if (!res.ok) throw new Error('Failed to fetch favorites');
      const data = await res.json();
      return data.data;
    },
  });

  const toggleFavorite = useMutation({
    mutationFn: async (promptId: string) => {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId }),
      });
      if (!res.ok) throw new Error('Failed to toggle favorite');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  return {
    favorites: favorites.data ?? [],
    isLoading: favorites.isPending,
    toggleFavorite: toggleFavorite.mutate,
    isToggling: toggleFavorite.isPending,
    isFavorite: (promptId: string) => favorites.data?.includes(promptId) ?? false,
  };
}
