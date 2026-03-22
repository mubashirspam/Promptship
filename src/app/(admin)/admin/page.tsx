import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Sparkles, DollarSign } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total Users', value: '0', icon: Users, color: 'text-blue-500' },
    { label: 'Total Prompts', value: '0', icon: FileText, color: 'text-purple-500' },
    { label: 'Generations Today', value: '0', icon: Sparkles, color: 'text-orange-500' },
    { label: 'Revenue (MTD)', value: '$0', icon: DollarSign, color: 'text-green-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className={`size-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
