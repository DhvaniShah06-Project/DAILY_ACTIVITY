'use client';

import { useMemo, useState, useEffect } from 'react';
import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { UpcomingItems } from '@/components/dashboard/upcoming-items';
import { AiInsightsCard } from '@/components/dashboard/ai-insights-card';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { useUser } from '@/firebase';
import type { Task, Bill, Expense } from '@/lib/types';
import { tasks as dummyTasks, bills as dummyBills, expenses as dummyExpenses, budget as dummyBudget } from '@/lib/data';

export default function DashboardPage() {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load all data from localStorage on mount
  useEffect(() => {
    // We wrap this in a try-catch block to prevent crashes if localStorage is disabled
    try {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks).map((task: any) => ({ ...task, dueDate: new Date(task.dueDate) })));
      } else {
        setTasks(dummyTasks);
        localStorage.setItem('tasks', JSON.stringify(dummyTasks));
      }

      const storedBills = localStorage.getItem('bills');
      if (storedBills) {
        setBills(JSON.parse(storedBills).map((bill: any) => ({ ...bill, dueDate: new Date(bill.dueDate), paymentDate: bill.paymentDate ? new Date(bill.paymentDate) : undefined })));
      } else {
        setBills(dummyBills);
        localStorage.setItem('bills', JSON.stringify(dummyBills));
      }

      const storedExpenses = localStorage.getItem('expenses');
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses).map((expense: any) => ({ ...expense, date: new Date(expense.date) })));
      } else {
        setExpenses(dummyExpenses);
        localStorage.setItem('expenses', JSON.stringify(dummyExpenses));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      // Fallback to dummy data if localStorage fails
      setTasks(dummyTasks);
      setBills(dummyBills);
      setExpenses(dummyExpenses);
    }
  }, []);

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
