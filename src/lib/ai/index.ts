import { generateWithClaude } from './providers/claude';
import { generateWithOpenAI } from './providers/openai';
import { buildPrompt } from './prompts/system-prompts';
import type { Framework, Style, AnimationLevel } from '@/lib/utils/constants';

export interface GenerateOptions {
  promptText: string;
  framework: Framework;
  style: Style;
  animationLevel: AnimationLevel;
  darkMode: boolean;
  borderRadius: number;
  primaryColor: string;
  customInstructions?: string;
}

export interface GenerateResult {
  code: string;
  tokensInput: number;
  tokensOutput: number;
  latencyMs: number;
  provider: 'claude' | 'openai';
  model: string;
}

export async function generateCode(options: GenerateOptions): Promise<GenerateResult> {
  const prompt = buildPrompt(options);
  const startTime = Date.now();

  try {
    const result = await generateWithClaude(prompt);
    return {
      ...result,
      latencyMs: Date.now() - startTime,
      provider: 'claude',
    };
  } catch (error) {
    console.error('Claude generation failed, falling back to OpenAI:', error);
    const result = await generateWithOpenAI(prompt);
    return {
      ...result,
      latencyMs: Date.now() - startTime,
      provider: 'openai',
    };
  }
}
