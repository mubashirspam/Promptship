import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // TODO: Fetch blog post from CMS or database
  if (!slug) notFound();

  return (
    <article className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-4">
          {slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
        </h1>
        <p className="text-muted-foreground">
          Blog content coming soon. This page will be populated with content from the CMS.
        </p>
      </div>
    </article>
  );
}
