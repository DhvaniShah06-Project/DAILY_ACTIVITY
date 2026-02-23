'use client';

import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { UpcomingItems } from '@/components/dashboard/upcoming-items';
import { AiInsightsCard } from '@/components/dashboard/ai-insights-card';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { tasks, bills, expenses, budget } from '@/lib/data';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <WelcomeHeader />
      <SummaryCards tasks={tasks} bills={bills} expenses={expenses} budget={budget} />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <UpcomingItems tasks={tasks} />
        </div>
        <div className="space-y-8">
          <QuickActions />
          <AiInsightsCard expenses={expenses} budget={budget} />
        </div>
      </div>
    </div>
  );
}
