import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateWithClaude(prompt: string) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  const code = textBlock?.text || '';

  return {
    code,
    tokensInput: response.usage.input_tokens,
    tokensOutput: response.usage.output_tokens,
    model: response.model,
  };
}
