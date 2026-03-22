import type { Framework, Style, AnimationLevel } from '@/lib/utils/constants';

export interface GeneratorOptions {
  promptId?: string;
  promptText: string;
  framework: Framework;
  style: Style;
  animationLevel: AnimationLevel;
  darkMode: boolean;
  borderRadius: number;
  primaryColor: string;
  customInstructions?: string;
}

export type GeneratorState =
  | 'IDLE'
  | 'VALIDATING'
  | 'CHECKING_CREDITS'
  | 'GENERATING'
  | 'SUCCESS'
  | 'ERROR';

export interface GenerationResult {
  id: string;
  code: string;
  framework: Framework;
  tokensInput: number;
  tokensOutput: number;
  latencyMs: number;
}
