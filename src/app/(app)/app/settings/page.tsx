'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  User,
  Settings2,
  CreditCard,
  Shield,
  Monitor,
  Smartphone,
  Globe,
  Trash2,
  LogOut,
} from 'lucide-react';
import { toast } from 'sonner';
import { FRAMEWORKS } from '@/lib/utils/constants';
import { TIER_LABELS, TIER_CREDITS, TIER_COLORS } from '@/lib/utils/constants';
import type { Tier } from '@/lib/utils/constants';
import Link from 'next/link';

export default function SettingsPage() {
  const { user } = useAuth();
  const tier = ((user as Record<string, unknown>)?.tier as Tier) ?? 'free';
  const credits = ((user as Record<string, unknown>)?.credits as number) ?? 0;

  const [name, setName] = useState(
    ((user as Record<string, unknown>)?.name as string) ?? ''
  );
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [defaultFramework, setDefaultFramework] = useState('react');
  const [currency, setCurrency] = useState('USD');
  const [theme, setTheme] = useState('system');

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
  };

  const handleSavePreferences = () => {
    toast.success('Preferences saved');
  };

  const handleSignOutAll = () => {
    toast.success('Signed out from all devices');
  };

  const handleDeleteAccount = () => {
    toast.success('Account deletion request submitted');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and billing.
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="size-3.5" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Settings2 className="size-3.5" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="size-3.5" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="size-3.5" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your name and manage your account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Avatar Placeholder */}
              <div className="flex items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-violet-600 text-white text-xl font-bold">
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium">Profile Photo</p>
                  <p className="text-xs text-muted-foreground">
                    Avatar customization coming soon
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="settings-name">Name</Label>
                <Input
                  id="settings-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="settings-email">Email</Label>
                <Input
                  id="settings-email"
                  type="email"
                  disabled
                  value={((user as Record<string, unknown>)?.email as string) ?? ''}
                  placeholder="email@example.com"
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your default settings and notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label>Default Framework</Label>
                <Select value={defaultFramework} onValueChange={setDefaultFramework}>
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FRAMEWORKS.map((fw) => (
                      <SelectItem key={fw} value={fw}>
                        {fw.charAt(0).toUpperCase() + fw.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Preferred Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="INR">INR (&#8377;)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Receive updates about new features and prompts
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Button onClick={handleSavePreferences}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <div className="space-y-5">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Manage your subscription and credits.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className={cn('font-semibold', TIER_COLORS[tier])}>
                        {TIER_LABELS[tier]}
                      </h3>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {credits} / {TIER_CREDITS[tier]} credits remaining
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href="/upgrade">Upgrade Plan</Link>
                  </Button>
                </div>

                {/* Credit Balance Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Credit Balance</span>
                    <span className="font-medium">{credits} credits</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-600 to-violet-600 transition-all"
                      style={{
                        width: `${Math.min(100, (credits / TIER_CREDITS[tier]) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CreditCard className="size-8 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No payment history yet. Upgrade your plan to get started.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="space-y-5">
            {/* Active Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Devices where you are currently signed in.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Monitor className="size-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Desktop - Chrome</p>
                      <p className="text-xs text-muted-foreground">
                        Current session &bull; Last active now
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">Current</Badge>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Smartphone className="size-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Mobile - Safari</p>
                      <p className="text-xs text-muted-foreground">
                        Last active 2 hours ago
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Globe className="size-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">API Access</p>
                      <p className="text-xs text-muted-foreground">
                        Last used 1 day ago
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <Button variant="outline" onClick={handleSignOutAll}>
                  <LogOut className="size-3.5" />
                  Sign Out All Devices
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible actions. Proceed with caution.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="size-3.5" />
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Account</DialogTitle>
                      <DialogDescription>
                        This action is permanent and cannot be undone. All your data,
                        generations, and progress will be deleted.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        Yes, Delete My Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
