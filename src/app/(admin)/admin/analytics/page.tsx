import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Analytics',
};

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">User Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Chart coming soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Chart coming soon</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
