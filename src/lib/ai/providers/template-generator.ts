/**
 * Template-based AI Code Generation
 * Handles detailed template prompts with technical specifications
 */

import { generateWithClaude } from './claude';
import type { prompts } from '@/lib/db/schema';

type PromptTemplate = typeof prompts.$inferSelect;

interface GenerationOptions {
  framework: 'react' | 'flutter' | 'html' | 'vue';
  includeComments?: boolean;
  useTailwind?: boolean;
  useTypeScript?: boolean;
}

interface GeneratedTemplateCode {
  code: string;
  framework: string;
  dependencies: string[];
  instructions?: string;
  technicalSpecs?: PromptTemplate['technicalSpecs'];
  tokensInput: number;
  tokensOutput: number;
  model: string;
}

/**
 * Build enhanced prompt from template with technical specifications
 */
function buildEnhancedPrompt(
  template: PromptTemplate,
  options: GenerationOptions
): string {
  const parts: string[] = [];

  // Add framework-specific instruction
  parts.push(`Generate production-ready ${options.framework.toUpperCase()} code for the following template:\n`);

  // Add detailed prompt if available
  if (template.detailedPrompt) {
    parts.push(template.detailedPrompt);
  } else {
    parts.push(template.promptText);
  }

  // Add technical specifications
  if (template.technicalSpecs) {
    parts.push('\n## Technical Requirements\n');

    // Fonts
    if (template.technicalSpecs.fonts?.length) {
      parts.push('### Fonts');
      template.technicalSpecs.fonts.forEach((font) => {
        parts.push(`- ${font.name} (weights: ${font.weights.join(', ')})`);
        if (font.url) parts.push(`  Import from: ${font.url}`);
      });
      parts.push('');
    }

    // Colors
    if (template.technicalSpecs.colors?.length) {
      parts.push('### Color Palette');
      template.technicalSpecs.colors.forEach((color) => {
        parts.push(`- ${color.name}: ${color.hsl} (${color.usage})`);
      });
      parts.push('');
    }

    // Animations
    if (template.technicalSpecs.animations?.length) {
      parts.push('### Animations');
      template.technicalSpecs.animations.forEach((anim) => {
        parts.push(`- ${anim.name}: ${anim.keyframes}`);
        parts.push(`  Usage: ${anim.usage}`);
      });
      parts.push('');
    }

    // Dependencies
    if (template.technicalSpecs.dependencies?.length) {
      parts.push('### Required Dependencies');
      template.technicalSpecs.dependencies
        .filter((dep) => dep.required)
        .forEach((dep) => {
          parts.push(`- ${dep.name}@${dep.version}`);
        });
      parts.push('');
    }

    // Assets
    if (template.technicalSpecs.assets?.length) {
      parts.push('### Assets');
      template.technicalSpecs.assets.forEach((asset) => {
        parts.push(`- ${asset.type}: ${asset.url}`);
        parts.push(`  ${asset.description}`);
      });
      parts.push('');
    }
  }

  // Add layout metadata
  if (template.layoutMetadata) {
    parts.push('\n## Layout Structure\n');
    
    if (template.layoutMetadata.sections?.length) {
      parts.push(`Sections: ${template.layoutMetadata.sections.join(', ')}`);
    }
    
    if (template.layoutMetadata.components?.length) {
      parts.push(`Components: ${template.layoutMetadata.components.join(', ')}`);
    }
    
    if (template.layoutMetadata.responsive) {
      parts.push('✓ Fully responsive design required');
    }
    
    if (template.layoutMetadata.darkMode) {
      parts.push('✓ Dark mode support required');
    }
    
    parts.push('');
  }

  // Add framework-specific instructions
  parts.push('\n## Code Generation Instructions\n');
  
  switch (options.framework) {
    case 'react':
      parts.push('- Use React 19 with functional components');
      parts.push('- Use TypeScript if specified');
      parts.push('- Use Tailwind CSS for styling');
      parts.push('- Follow React best practices (hooks, composition)');
      parts.push('- Include proper prop types');
      break;
    
    case 'vue':
      parts.push('- Use Vue 3 Composition API');
      parts.push('- Use TypeScript if specified');
      parts.push('- Use Tailwind CSS for styling');
      parts.push('- Follow Vue 3 best practices');
      break;
    
    case 'flutter':
      parts.push('- Use Flutter 3.x');
      parts.push('- Follow Material Design 3 guidelines');
      parts.push('- Use proper widget composition');
      parts.push('- Include responsive layouts');
      break;
    
    case 'html':
      parts.push('- Use semantic HTML5');
      parts.push('- Use Tailwind CSS for styling');
      parts.push('- Include vanilla JavaScript if needed');
      parts.push('- Ensure accessibility (ARIA labels)');
      break;
  }

  if (options.includeComments) {
    parts.push('- Add helpful code comments');
  }

  parts.push('\n## Output Format\n');
  parts.push('Return ONLY the complete, production-ready code.');
  parts.push('Do not include explanations or markdown code blocks.');
  parts.push('The code should be ready to copy-paste and run.');

  return parts.join('\n');
}

/**
 * Extract dependencies from technical specs
 */
function extractDependencies(template: PromptTemplate): string[] {
  const deps: string[] = [];

  if (template.technicalSpecs?.dependencies) {
    template.technicalSpecs.dependencies.forEach((dep) => {
      deps.push(`${dep.name}@${dep.version}`);
    });
  }

  return deps;
}

/**
 * Generate code from premium template
 */
export async function generateFromTemplate(
  template: PromptTemplate,
  options: GenerationOptions
): Promise<GeneratedTemplateCode> {
  // Build enhanced prompt with all technical specifications
  const enhancedPrompt = buildEnhancedPrompt(template, options);

  // Generate code using Claude
  const result = await generateWithClaude(enhancedPrompt);

  // Extract dependencies
  const dependencies = extractDependencies(template);

  // Build instructions if available
  let instructions: string | undefined;
  if (template.technicalSpecs?.dependencies?.length) {
    const installCmd = options.framework === 'flutter' 
      ? 'flutter pub add'
      : 'pnpm add';
    
    instructions = `Install dependencies:\n${installCmd} ${dependencies.join(' ')}`;
  }

  return {
    code: result.code,
    framework: options.framework,
    dependencies,
    instructions,
    technicalSpecs: template.technicalSpecs,
    tokensInput: result.tokensInput,
    tokensOutput: result.tokensOutput,
    model: result.model,
  };
}

/**
 * Generate multiple framework versions from template
 */
export async function generateMultiFramework(
  template: PromptTemplate,
  frameworks: GenerationOptions['framework'][]
): Promise<Record<string, GeneratedTemplateCode>> {
  const results: Record<string, GeneratedTemplateCode> = {};

  for (const framework of frameworks) {
    results[framework] = await generateFromTemplate(template, {
      framework,
      includeComments: true,
      useTailwind: true,
      useTypeScript: framework === 'react' || framework === 'vue',
    });
  }

  return results;
}
