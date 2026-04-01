#!/usr/bin/env tsx
/**
 * Component Scaffolding Script
 * Generates component boilerplate following PromptShip architecture
 * 
 * Usage:
 *   pnpm scaffold:component <type> <name>
 * 
 * Examples:
 *   pnpm scaffold:component auth LoginForm
 *   pnpm scaffold:component shared Button
 *   pnpm scaffold:component generator CodeEditor
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const COMPONENT_TYPES = {
  ui: 'src/components/ui',
  shared: 'src/components/shared',
  layout: 'src/components/layout',
  auth: 'src/components/auth',
  dashboard: 'src/components/dashboard',
  prompts: 'src/components/prompts',
  generator: 'src/components/generator',
  marketing: 'src/components/marketing',
  admin: 'src/components/admin',
  providers: 'src/components/providers',
} as const;

type ComponentType = keyof typeof COMPONENT_TYPES;

function generateServerComponent(name: string): string {
  return `interface ${name}Props {
  // Add props here
}

export function ${name}({}: ${name}Props) {
  return (
    <div>
      {/* Add content here */}
    </div>
  );
}
`;
}

function generateClientComponent(name: string): string {
  return `'use client';

import { useState } from 'react';

interface ${name}Props {
  // Add props here
}

export function ${name}({}: ${name}Props) {
  // Add state and handlers here
  
  return (
    <div>
      {/* Add content here */}
    </div>
  );
}
`;
}

function generateApiRoute(): string {
  return `import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/utils/rate-limit';

export async function GET(req: NextRequest) {
  try {
    // 1. Rate limiting
    await rateLimit(req);
    
    // 2. Authentication (remove if public endpoint)
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 3. Business logic
    const data = await db.query.yourTable.findMany();
    
    // 4. Response
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting
    await rateLimit(req);
    
    // 2. Authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 3. Validation
    const body = await req.json();
    // const validated = yourSchema.parse(body);
    
    // 4. Business logic
    // const result = await db.insert(yourTable).values(validated);
    
    // 5. Response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
`;
}

function generateServerAction(name: string): string {
  const actionName = name.charAt(0).toLowerCase() + name.slice(1);
  
  return `'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
// import { yourSchema } from '@/lib/validations/your-module';

export async function ${actionName}(data: unknown) {
  // 1. Authentication
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  
  // 2. Validation
  // const validated = yourSchema.parse(data);
  
  // 3. Business logic
  try {
    // const result = await db.insert(yourTable).values(validated);
    return { success: true };
  } catch (error) {
    console.error('Action error:', error);
    return { success: false, error: 'Operation failed' };
  }
}
`;
}

function generateZodSchema(name: string): string {
  const schemaName = name.charAt(0).toLowerCase() + name.slice(1);
  
  return `import { z } from 'zod';

export const ${schemaName}Schema = z.object({
  // Add validation rules here
  // Example:
  // title: z.string().min(1).max(255),
  // description: z.string().min(10),
});

export type ${name}Input = z.infer<typeof ${schemaName}Schema>;
`;
}

function scaffoldComponent(type: ComponentType, name: string, isClient: boolean = false) {
  const basePath = COMPONENT_TYPES[type];
  const filePath = join(process.cwd(), basePath, `${name}.tsx`);
  
  if (existsSync(filePath)) {
    console.error(`❌ Component already exists: ${filePath}`);
    process.exit(1);
  }
  
  const content = isClient ? generateClientComponent(name) : generateServerComponent(name);
  
  mkdirSync(join(process.cwd(), basePath), { recursive: true });
  writeFileSync(filePath, content);
  
  console.log(`✅ Created component: ${basePath}/${name}.tsx`);
  console.log(`   Type: ${isClient ? 'Client Component' : 'Server Component'}`);
}

function scaffoldApiRoute(path: string) {
  const routePath = join(process.cwd(), 'src/app/api', path, 'route.ts');
  
  if (existsSync(routePath)) {
    console.error(`❌ API route already exists: ${routePath}`);
    process.exit(1);
  }
  
  const content = generateApiRoute();
  
  mkdirSync(join(process.cwd(), 'src/app/api', path), { recursive: true });
  writeFileSync(routePath, content);
  
  console.log(`✅ Created API route: src/app/api/${path}/route.ts`);
}

function scaffoldServerAction(name: string) {
  const actionPath = join(process.cwd(), 'src/app/actions', `${name}.ts`);
  
  if (existsSync(actionPath)) {
    console.error(`❌ Server action already exists: ${actionPath}`);
    process.exit(1);
  }
  
  const content = generateServerAction(name);
  
  mkdirSync(join(process.cwd(), 'src/app/actions'), { recursive: true });
  writeFileSync(actionPath, content);
  
  console.log(`✅ Created server action: src/app/actions/${name}.ts`);
}

function scaffoldValidation(name: string) {
  const validationPath = join(process.cwd(), 'src/lib/validations', `${name}.ts`);
  
  if (existsSync(validationPath)) {
    console.error(`❌ Validation schema already exists: ${validationPath}`);
    process.exit(1);
  }
  
  const content = generateZodSchema(name);
  
  mkdirSync(join(process.cwd(), 'src/lib/validations'), { recursive: true });
  writeFileSync(validationPath, content);
  
  console.log(`✅ Created validation schema: src/lib/validations/${name}.ts`);
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.log(`
Usage:
  pnpm scaffold:component <type> <name> [--client]
  pnpm scaffold:api <path>
  pnpm scaffold:action <name>
  pnpm scaffold:validation <name>

Component Types:
  ${Object.keys(COMPONENT_TYPES).join(', ')}

Examples:
  pnpm scaffold:component auth LoginForm --client
  pnpm scaffold:component shared Card
  pnpm scaffold:api prompts/[id]
  pnpm scaffold:action createPrompt
  pnpm scaffold:validation prompt
  `);
  process.exit(1);
}

switch (command) {
  case 'component': {
    const type = args[1] as ComponentType;
    const name = args[2];
    const isClient = args.includes('--client');
    
    if (!type || !name) {
      console.error('❌ Usage: pnpm scaffold:component <type> <name> [--client]');
      process.exit(1);
    }
    
    if (!COMPONENT_TYPES[type]) {
      console.error(`❌ Invalid type. Choose from: ${Object.keys(COMPONENT_TYPES).join(', ')}`);
      process.exit(1);
    }
    
    scaffoldComponent(type, name, isClient);
    break;
  }
  
  case 'api': {
    const path = args[1];
    if (!path) {
      console.error('❌ Usage: pnpm scaffold:api <path>');
      process.exit(1);
    }
    scaffoldApiRoute(path);
    break;
  }
  
  case 'action': {
    const name = args[1];
    if (!name) {
      console.error('❌ Usage: pnpm scaffold:action <name>');
      process.exit(1);
    }
    scaffoldServerAction(name);
    break;
  }
  
  case 'validation': {
    const name = args[1];
    if (!name) {
      console.error('❌ Usage: pnpm scaffold:validation <name>');
      process.exit(1);
    }
    scaffoldValidation(name);
    break;
  }
  
  default:
    console.error(`❌ Unknown command: ${command}`);
    process.exit(1);
}
