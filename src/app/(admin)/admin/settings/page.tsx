import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Admin Settings',
};

interface EnvVarStatus {
  name: string;
  label: string;
  isSet: boolean;
  category: string;
}

function getEnvStatus(): EnvVarStatus[] {
  return [
    { name: 'DATABASE_URL', label: 'Database URL', isSet: !!process.env.DATABASE_URL, category: 'Database' },
    { name: 'BETTER_AUTH_SECRET', label: 'Auth Secret', isSet: !!process.env.BETTER_AUTH_SECRET, category: 'Authentication' },
    { name: 'BETTER_AUTH_URL', label: 'Auth URL', isSet: !!process.env.BETTER_AUTH_URL, category: 'Authentication' },
    { name: 'GOOGLE_CLIENT_ID', label: 'Google OAuth', isSet: !!process.env.GOOGLE_CLIENT_ID, category: 'OAuth' },
    { name: 'GITHUB_CLIENT_ID', label: 'GitHub OAuth', isSet: !!process.env.GITHUB_CLIENT_ID, category: 'OAuth' },
    { name: 'ANTHROPIC_API_KEY', label: 'Anthropic API', isSet: !!process.env.ANTHROPIC_API_KEY, category: 'AI' },
    { name: 'OPENAI_API_KEY', label: 'OpenAI API', isSet: !!process.env.OPENAI_API_KEY, category: 'AI' },
    { name: 'STRIPE_SECRET_KEY', label: 'Stripe Secret', isSet: !!process.env.STRIPE_SECRET_KEY, category: 'Payments' },
    { name: 'STRIPE_WEBHOOK_SECRET', label: 'Stripe Webhook', isSet: !!process.env.STRIPE_WEBHOOK_SECRET, category: 'Payments' },
    { name: 'RAZORPAY_KEY_ID', label: 'Razorpay Key', isSet: !!process.env.RAZORPAY_KEY_ID, category: 'Payments' },
    { name: 'RESEND_API_KEY', label: 'Resend Email', isSet: !!process.env.RESEND_API_KEY, category: 'Email' },
  ];
}

export default function AdminSettingsPage() {
  const envVars = getEnvStatus();
  const categories = [...new Set(envVars.map((v) => v.category))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Platform configuration and environment status
        </p>
      </div>

      {/* Platform Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Platform Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex justify-between rounded-lg border px-4 py-3">
              <span className="text-sm text-muted-foreground">App Name</span>
              <span className="text-sm font-medium">{siteConfig.name}</span>
            </div>
            <div className="flex justify-between rounded-lg border px-4 py-3">
              <span className="text-sm text-muted-foreground">App URL</span>
              <span className="text-sm font-medium">{siteConfig.appUrl}</span>
            </div>
            <div className="flex justify-between rounded-lg border px-4 py-3">
              <span className="text-sm text-muted-foreground">Admin URL</span>
              <span className="text-sm font-medium">{siteConfig.adminUrl}</span>
            </div>
            <div className="flex justify-between rounded-lg border px-4 py-3">
              <span className="text-sm text-muted-foreground">Environment</span>
              <Badge variant="outline">
                {process.env.NODE_ENV}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environment Variables Status */}
      {categories.map((category) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{category}</CardTitle>
            <CardDescription>
              Environment variable status for {category.toLowerCase()} services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {envVars
                .filter((v) => v.category === category)
                .map((v) => (
                  <div
                    key={v.name}
                    className="flex items-center justify-between rounded-lg border px-4 py-3"
                  >
                    <div>
                      <span className="text-sm font-medium">{v.label}</span>
                      <p className="text-xs text-muted-foreground">{v.name}</p>
                    </div>
                    <Badge
                      variant={v.isSet ? 'default' : 'destructive'}
                    >
                      {v.isSet ? 'Configured' : 'Missing'}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
