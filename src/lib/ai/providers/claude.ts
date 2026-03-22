import Anthropic from '@anthropic-ai/sdk';

function getAnthropicClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key is not configured');
  }
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

export async function generateWithClaude(prompt: string) {
  const anthropic = getAnthropicClient();
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
