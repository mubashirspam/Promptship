import { create } from 'zustand';

type GeneratorStatus = 'idle' | 'validating' | 'checking_credits' | 'generating' | 'success' | 'error';

interface GeneratorStore {
  status: GeneratorStatus;
  error: string | null;
  // Config
  template: string;
  framework: string;
  style: string;
  primaryColor: string;
  darkMode: boolean;
  animationLevel: string;
  customInstructions: string;
  // Output
  generatedCode: string | null;
  previewHtml: string | null;
  tokensUsed: number;
  latencyMs: number;
  // Actions
  setField: <K extends keyof GeneratorStore>(key: K, value: GeneratorStore[K]) => void;
  generate: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  status: 'idle' as GeneratorStatus,
  error: null as string | null,
  template: 'login-screen',
  framework: 'react',
  style: 'glassmorphism',
  primaryColor: '#7C3AED',
  darkMode: true,
  animationLevel: 'subtle',
  customInstructions: '',
  generatedCode: null as string | null,
  previewHtml: null as string | null,
  tokensUsed: 0,
  latencyMs: 0,
};

export const useGeneratorStore = create<GeneratorStore>((set, get) => ({
  ...initialState,

  setField: (key, value) => set({ [key]: value } as Partial<GeneratorStore>),

  generate: async () => {
    const state = get();
    set({ status: 'generating', error: null });

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: state.template,
          framework: state.framework,
          style: state.style,
          primaryColor: state.primaryColor,
          darkMode: state.darkMode,
          animationLevel: state.animationLevel,
          customInstructions: state.customInstructions,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          (body as Record<string, Record<string, string>>)?.error?.message || 'Generation failed'
        );
      }

      const body = await res.json();
      const data = body.data ?? body;

      set({
        generatedCode: data.code ?? data.generatedCode ?? null,
        previewHtml: data.previewHtml ?? null,
        tokensUsed: data.tokensUsed ?? data.tokensOutput ?? 0,
        latencyMs: data.latencyMs ?? 0,
        status: 'success',
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'An unknown error occurred',
        status: 'error',
      });
    }
  },

  reset: () => set(initialState),
}));
