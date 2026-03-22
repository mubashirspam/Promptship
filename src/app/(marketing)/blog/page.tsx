import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest articles, tutorials, and updates from PromptShip.',
};

const posts = [
  {
    slug: 'getting-started-with-ai-ui-generation',
    title: 'Getting Started with AI UI Generation',
    description: 'Learn how to use AI prompts to generate beautiful UI components in minutes.',
    date: '2026-03-20',
    category: 'Tutorial',
  },
  {
    slug: 'best-practices-for-prompt-engineering',
    title: 'Best Practices for Prompt Engineering',
    description: 'Tips and tricks to write better prompts for UI code generation.',
    date: '2026-03-15',
    category: 'Guide',
  },
  {
    slug: 'flutter-vs-react-ai-generation',
    title: 'Flutter vs React: AI Code Generation Compared',
    description: 'A deep dive into AI-generated code quality across frameworks.',
    date: '2026-03-10',
    category: 'Comparison',
  },
];

export default function BlogPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground mb-12">
          Latest articles, tutorials, and updates.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">{post.category}</Badge>
                  <CardTitle className="mt-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{post.description}</p>
                  <p className="text-xs text-muted-foreground mt-4">{post.date}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
