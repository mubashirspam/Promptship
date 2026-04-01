# Generator Module Context

## Purpose
AI-powered code generation from prompts. Converts user prompts into production-ready code for React, Flutter, HTML, or Vue.

## Dependencies
- `@/lib/ai/anthropic` - Claude API client
- `@/lib/ai/openai` - OpenAI API client  
- `@/lib/validations/generator` - Input validation schemas
- `@/stores/generator-store` - Client state (framework selection, settings)

## Key Constraints

### Input Validation
```typescript
// ALWAYS validate before generation
const validated = generateCodeSchema.parse(input);
```

### Output Structure
```typescript
interface GeneratedCode {
  code: string;
  framework: 'react' | 'flutter' | 'html' | 'vue';
  dependencies: string[];
  instructions?: string;
}
```

### AI Provider Abstraction
- NEVER instantiate AI clients directly in components
- USE `generateCode()` from `@/lib/ai/anthropic` or `@/lib/ai/openai`
- ALWAYS handle streaming responses properly

### Rate Limiting
- Check user tier limits before generation
- Track generation count in database
- Return clear error messages when limit exceeded

### Error Handling
```typescript
try {
  const result = await generateCode(prompt);
  return { success: true, data: result };
} catch (error) {
  if (error instanceof RateLimitError) {
    return { success: false, error: 'Rate limit exceeded' };
  }
  // Log error, return generic message
  return { success: false, error: 'Generation failed' };
}
```

## Component Patterns

### Client Components
- `CodeEditor` - Interactive code display/editing
- `FrameworkSelector` - Framework toggle
- `GenerateButton` - Trigger generation (needs onClick)

### Server Components  
- `GenerationHistory` - Display past generations
- `UsageLimits` - Show tier limits

## State Management
- Framework selection → Zustand (`useGeneratorStore`)
- Generation history → React Query
- Form inputs → React Hook Form

## Security
- Sanitize user prompts before sending to AI
- Validate generated code doesn't contain secrets
- Log all generations for audit trail
