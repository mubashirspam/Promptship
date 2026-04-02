import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { FileText, BookOpen, Code } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Documentation',
};

export default function DocsPage() {
  const sections = [
    {
      title: 'Architecture',
      description: 'Complete technical architecture and system design document.',
      href: '/docs/architecture',
      icon: FileText,
    },
    {
      title: 'API Reference',
      description: 'API endpoints, authentication, and usage guides.',
      href: '/docs/architecture',
      icon: Code,
    },
    {
      title: 'Getting Started',
      description: 'Quick start guide for new users.',
      href: '/docs/architecture',
      icon: BookOpen,
    },
  ];

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">Documentation</h1>
        <p className="text-muted-foreground mb-12">
          Everything you need to know about Promtify.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {sections.map(({ title, description, href, icon: Icon }) => (
            <Link key={title} href={href}>
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Icon className="size-8 text-primary" />
                  <CardTitle className="mt-2">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
