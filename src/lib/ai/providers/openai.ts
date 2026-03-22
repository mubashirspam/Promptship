import OpenAI from 'openai';

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function generateWithOpenAI(prompt: string) {
  const openai = getOpenAIClient();
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const code = response.choices[0]?.message?.content || '';

  return {
    code,
    tokensInput: response.usage?.prompt_tokens || 0,
    tokensOutput: response.usage?.completion_tokens || 0,
    model: response.model,
  };
}
