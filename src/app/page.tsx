import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { UpcomingItems } from '@/components/dashboard/upcoming-items';
import { AiInsightsCard } from '@/components/dashboard/ai-insights-card';
import { FileText, Lightbulb, LocateFixed } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <WelcomeHeader />
      <QuickActions />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UpcomingItems />
        </div>
        <div className="space-y-8">
          <AiInsightsCard />
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Generate and view your monthly summaries.
              </p>
              <Button asChild>
                <Link href="/reports">View Reports</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <LocateFixed className="h-5 w-5 text-primary" />
                Smart Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Get location-based reminders for your errands.
              </p>
              <Button asChild>
                <Link href="/reminders">Set Reminder</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
