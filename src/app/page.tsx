'use client';

import { useMemo, useState } from 'react';
import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { UpcomingItems } from '@/components/dashboard/upcoming-items';
import { AiInsightsCard } from '@/components/dashboard/ai-insights-card';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { useUser } from '@/firebase';
import type { Task, Bill, Expense } from '@/lib/types';
import { tasks as dummyTasks, bills as dummyBills, expenses as dummyExpenses, budget as dummyBudget } from '@/lib/data';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useUser(); // Keep for welcome message etc.
  const [tasks, setTasks] = useState<Task[]>(dummyTasks);
  const [bills, setBills] = useState<Bill[]>(dummyBills);
  const [expenses, setExpenses] = useState<Expense[]>(dummyExpenses);
  const [isLoading, setIsLoading] = useState(false); // We don't have real loading, so set to false

  // Dummy budget data as it's not in Firestore yet
  const budget = useMemo(() => {
    const totalSpent = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    return {
      total: dummyBudget.total,
      categories: dummyBudget.categories.map(cat => ({
          ...cat,
          spent: expenses.filter(e => e.category === cat.name).reduce((a,b)=>a+b.amount,0)
      })),
    };
  }, [expenses]);
  
  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <WelcomeHeader />
      <SummaryCards
        tasks={tasks}
        bills={bills}
        expenses={expenses}
        budget={budget}
      />
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
