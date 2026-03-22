import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manage Prompts',
};

export default function AdminPromptsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Prompts</h1>
        <Button>
          <Plus className="size-4" />
          Add Prompt
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">All Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No prompts yet. Add your first prompt to get started.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
