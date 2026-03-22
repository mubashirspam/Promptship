import { create } from 'zustand';

interface AuthState {
  isAuthModalOpen: boolean;
  authMode: 'login' | 'signup';
  callbackUrl: string | null;
  openAuthModal: (mode?: 'login' | 'signup', callbackUrl?: string | null) => void;
  closeAuthModal: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthModalOpen: false,
  authMode: 'login',
  callbackUrl: null,
  openAuthModal: (mode = 'login', callbackUrl = null) =>
    set({ isAuthModalOpen: true, authMode: mode, callbackUrl }),
  closeAuthModal: () =>
    set({ isAuthModalOpen: false, callbackUrl: null }),
}));
