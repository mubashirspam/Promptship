import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/logo';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  description,
  children,
  className,
}: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className={cn('w-full max-w-sm', className)}>
        <CardHeader className="items-center text-center">
          <Logo className="mb-2 justify-center" />
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
