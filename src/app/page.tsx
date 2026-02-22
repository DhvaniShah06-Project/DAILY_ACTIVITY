'use client';

import { useMemo } from 'react';
import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { UpcomingItems } from '@/components/dashboard/upcoming-items';
import { AiInsightsCard } from '@/components/dashboard/ai-insights-card';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { useUser, useFirestore } from '@/firebase';
import { useCollection, WithId } from '@/firebase/firestore/use-collection';
import { collection, Timestamp } from 'firebase/firestore';
import type { Task, Bill, Expense } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { budget as staticBudget } from '@/lib/data';

function processFirestoreData<T extends { dueDate?: any; date?: any }>(
  data: WithId<T>[] | null
): WithId<T>[] {
  if (!data) return [];
  return data.map((item) => {
    const processedItem = { ...item };
    if (item.dueDate && item.dueDate instanceof Timestamp) {
      processedItem.dueDate = item.dueDate.toDate();
    }
    if (item.date && item.date instanceof Timestamp) {
      processedItem.date = item.date.toDate();
    }
    return processedItem;
  });
}

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const tasksRef = useMemo(
    () => (user ? collection(firestore, 'users', user.uid, 'tasks') : null),
    [user, firestore]
  );
  const billsRef = useMemo(
    () => (user ? collection(firestore, 'users', user.uid, 'bills') : null),
    [user, firestore]
  );
  const expensesRef = useMemo(
    () => (user ? collection(firestore, 'users', user.uid, 'expenses') : null),
    [user, firestore]
  );

  const { data: rawTasks, isLoading: loadingTasks } = useCollection<Task>(tasksRef);
  const { data: rawBills, isLoading: loadingBills } = useCollection<Bill>(billsRef);
  const { data: rawExpenses, isLoading: loadingExpenses } = useCollection<Expense>(expensesRef);

  const tasks = useMemo(() => processFirestoreData(rawTasks), [rawTasks]);
  const bills = useMemo(() => processFirestoreData(rawBills), [rawBills]);
  const expenses = useMemo(() => processFirestoreData(rawExpenses), [rawExpenses]);

  const isLoading = loadingTasks || loadingBills || loadingExpenses;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <WelcomeHeader />
      <SummaryCards tasks={tasks} bills={bills} expenses={expenses} budget={staticBudget} />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <UpcomingItems tasks={tasks} />
        </div>
        <div className="space-y-8">
          <QuickActions />
          <AiInsightsCard expenses={expenses} budget={staticBudget} />
        </div>
      </div>
    </div>
  );
}
