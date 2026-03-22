import type { GenerateOptions } from '../index';

export function buildPrompt(options: GenerateOptions): string {
  const {
    promptText,
    framework,
    style,
    animationLevel,
    darkMode,
    borderRadius,
    primaryColor,
    customInstructions,
  } = options;

  const frameworkInstructions = getFrameworkInstructions(framework);
  const styleInstructions = getStyleInstructions(style);

  return `You are an expert UI developer. Generate production-ready ${framework} code based on the following specifications.

## Framework
${frameworkInstructions}

## Design Requirements
- Style: ${styleInstructions}
- Dark Mode: ${darkMode ? 'Yes, use dark color scheme' : 'No, use light color scheme'}
- Border Radius: ${borderRadius}px
- Primary Color: ${primaryColor}
- Animation Level: ${animationLevel === 'none' ? 'No animations' : animationLevel === 'subtle' ? 'Subtle hover/transition animations' : 'Dynamic entrance and interaction animations'}

## Component Request
${promptText}

${customInstructions ? `## Additional Instructions\n${customInstructions}` : ''}

## Output Requirements
- Return ONLY the code, no explanations
- Include all necessary imports
- Use TypeScript where applicable
- Make the component fully responsive
- Follow accessibility best practices (ARIA labels, semantic HTML)
- Use modern patterns and best practices for the chosen framework`;
}

function getFrameworkInstructions(framework: string): string {
  switch (framework) {
    case 'react':
      return 'Generate a React component using TypeScript and Tailwind CSS. Use functional components with hooks. Export as default.';
    case 'flutter':
      return 'Generate a Flutter widget using Dart. Use StatelessWidget or StatefulWidget as appropriate. Include Material Design widgets.';
    case 'html':
      return 'Generate standalone HTML with inline CSS and vanilla JavaScript. Make it a complete, self-contained file.';
    case 'vue':
      return 'Generate a Vue 3 component using Composition API with <script setup lang="ts"> and Tailwind CSS.';
    default:
      return 'Generate a React component using TypeScript and Tailwind CSS.';
  }
}

function getStyleInstructions(style: string): string {
  switch (style) {
    case 'minimal':
      return 'Clean, minimal design with subtle borders and ample whitespace. Focus on typography and content hierarchy.';
    case 'glassmorphism':
      return 'Glass morphism style with frosted glass effects, backdrop blur, semi-transparent backgrounds, and subtle borders.';
    case 'gradient':
      return 'Rich gradients, colorful backgrounds, gradient text effects, and vibrant color schemes.';
    case 'bold':
      return 'Bold, high-contrast design with strong colors, thick borders, large typography, and prominent shadows.';
    case 'neumorphism':
      return 'Neumorphic design with soft shadows, subtle depth effects, and muted color palette.';
    default:
      return 'Clean, modern design with good contrast and readability.';
  }
}
