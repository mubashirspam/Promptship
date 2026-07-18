import type { Metadata } from 'next';
import { GraduationCap } from 'lucide-react';
import { ComingSoon } from '@/components/shared/coming-soon';

export const metadata: Metadata = {
  title: 'Courses',
};

export default function LearnPage() {
  return (
    <ComingSoon
      icon={GraduationCap}
      title="Courses"
      description="A guided curriculum to master AI-powered UI development — from your first prompt to production-ready design systems."
      highlights={[
        'Structured modules with hands-on lessons',
        'Real-world component and layout projects',
        'Track your progress as you learn',
      ]}
    />
  );
}
