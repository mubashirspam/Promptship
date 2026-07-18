'use client';

import { useAuth } from '@/hooks/use-auth';
import { WelcomeBanner } from '@/components/dashboard/welcome-banner';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { CourseProgressCard } from '@/components/dashboard/course-progress-card';
import { RecentGenerations } from '@/components/dashboard/recent-generations';
import { WelcomeVideo } from '@/components/dashboard/welcome-video';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { NewPromptsWidget } from '@/components/dashboard/new-prompts-widget';

export default function DashboardPage() {
  const { user } = useAuth();
  const userName = (user as Record<string, unknown>)?.name as string | undefined;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      {/* Main column */}
      <div className="space-y-6">
        <WelcomeBanner userName={userName} />
        <QuickActions />
        <CourseProgressCard />
        <RecentGenerations />
      </div>

      {/* Sidebar widgets */}
      <div className="space-y-6">
        <WelcomeVideo />
        <StatsCards />
        <NewPromptsWidget />
      </div>
    </div>
  );
}
