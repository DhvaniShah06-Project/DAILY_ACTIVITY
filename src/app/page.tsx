import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { UpcomingItems } from '@/components/dashboard/upcoming-items';
import { AiInsightsCard } from '@/components/dashboard/ai-insights-card';
import { SummaryCards } from '@/components/dashboard/summary-cards';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <WelcomeHeader />
      <SummaryCards />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <UpcomingItems />
        </div>
        <div className="space-y-8">
          <QuickActions />
          <AiInsightsCard />
        </div>
      </div>
    </div>
  );
}
