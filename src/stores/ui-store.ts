import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  currency: 'USD' | 'INR';
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrency: (currency: 'USD' | 'INR') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  currency: 'USD',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrency: (currency) => set({ currency }),
}));
