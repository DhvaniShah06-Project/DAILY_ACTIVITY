'use client';
import { useState, useEffect, useMemo } from 'react';
import type { Expense } from '@/lib/types';
import { expenses as dummyExpenses, budget as dummyBudget } from '@/lib/data';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/empty-state';
import { ExpenseList } from './components/expense-list';
import { BudgetOverview } from './components/budget-overview';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { ExpenseForm } from './components/expense-form';
import { useToast } from '@/hooks/use-toast';

export default function ExpensesPage() {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedExpenses = localStorage.getItem('expenses');
      if (storedExpenses) {
        const parsedExpenses = JSON.parse(storedExpenses).map((expense: any) => ({
          ...expense,
          date: new Date(expense.date),
        }));
        setExpenses(parsedExpenses);
      } else {
        setExpenses(dummyExpenses);
      }
    } catch (error) {
      console.error("Failed to load expenses from localStorage", error);
      setExpenses(dummyExpenses);
    } finally {
      setIsInitialLoad(false);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [expenses, isInitialLoad]);

  const budget = useMemo(() => {
    const categorySpending = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: dummyBudget.total,
      categories: dummyBudget.categories.map(cat => ({
        ...cat,
        spent: categorySpending[cat.name] || 0
      })),
    };
  }, [expenses]);


  useEffect(() => {
    if (window.location.hash === '#add') {
      setIsDialogOpen(true);
    }
  }, []);

  const handleLogExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
    };

    setExpenses(prevExpenses => [newExpense, ...prevExpenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    toast({ title: 'Success', description: 'Expense logged.' });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Expenses</h1>
          <p className="text-muted-foreground">
            Keep track of your spending and manage your budget.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <PlusCircle className="mr-2 h-5 w-5" />
              Log Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline">Log a new expense</DialogTitle>
              <DialogDescription>
                Enter the amount, category, and notes for your expense.
              </DialogDescription>
            </DialogHeader>
            <ExpenseForm onSubmit={handleLogExpense} />
          </DialogContent>
        </Dialog>
      </div>
      
      <>
        <BudgetOverview budget={budget} expenses={expenses} />
        {expenses.length > 0 ? (
          <ExpenseList expenses={expenses} />
        ) : (
          <EmptyState
            title="No expenses logged!"
            description="Start tracking your spending by logging your first expense."
            imageSrc="https://picsum.photos/seed/empty-expenses/400/300"
            imageAlt="Empty expense list"
            imageHint="no money"
          >
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Log Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="font-headline">Log a new expense</DialogTitle>
                  <DialogDescription>
                    Enter the amount, category, and notes for your expense.
                  </DialogDescription>
                </DialogHeader>
                <ExpenseForm onSubmit={handleLogExpense} />
              </DialogContent>
            </Dialog>
          </EmptyState>
        )}
      </>
    </div>
  );
}
