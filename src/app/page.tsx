'use client';

import { useMemo } from 'react';
import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { UpcomingItems } from '@/components/dashboard/upcoming-items';
import { AiInsightsCard } from '@/components/dashboard/ai-insights-card';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { useUser, useFirestore } from '@/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import type { Task, Bill, Expense } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const collections = {
      tasks: collection(db, 'users', user.uid, 'tasks'),
      bills: collection(db, 'users', user.uid, 'bills'),
      expenses: collection(db, 'users', user.uid, 'expenses'),
    };

    const unsubscribes = [
      onSnapshot(query(collections.tasks), (snapshot) => {
        setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), dueDate: doc.data().dueDate.toDate() })) as Task[]);
        setIsLoading(false);
      }),
      onSnapshot(query(collections.bills), (snapshot) => {
        setBills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), dueDate: doc.data().dueDate.toDate() })) as Bill[]);
      }),
      onSnapshot(query(collections.expenses), (snapshot) => {
        setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), date: doc.data().date.toDate() })) as Expense[]);
      }),
    ];

    return () => unsubscribes.forEach(unsub => unsub());

  }, [user, db]);

  // Dummy budget data as it's not in Firestore yet
  const budget = useMemo(() => ({
    total: 1000,
    categories: [
      { name: 'Grocery', total: 400, spent: expenses.filter(e=>e.category === 'Grocery').reduce((a,b)=>a+b.amount,0) },
      { name: 'Transport', total: 150, spent: expenses.filter(e=>e.category === 'Transport').reduce((a,b)=>a+b.amount,0) },
      { name: 'Entertainment', total: 100, spent: expenses.filter(e=>e.category === 'Entertainment').reduce((a,b)=>a+b.amount,0) },
      { name: 'Bills', total: 250, spent: expenses.filter(e=>e.category === 'Bills').reduce((a,b)=>a+b.amount,0) },
      { name: 'Other', total: 100, spent: expenses.filter(e=>e.category === 'Other').reduce((a,b)=>a+b.amount,0) },
    ],
  }), [expenses]);
  
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
