import type { Metadata } from 'next';
import { BlogForm } from '@/components/admin/blog-form';

export const metadata: Metadata = {
  title: 'New Blog Post',
};

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Create New Blog Post</h1>
      <BlogForm />
    </div>
  );
}
