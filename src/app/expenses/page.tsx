'use client';
import { useState, useEffect, useMemo } from 'react';
import type { Expense } from '@/lib/types';
import { budget as initialBudget } from '@/lib/data';
import { Loader2, PlusCircle } from 'lucide-react';
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
import { useUser, useFirestore } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, Timestamp, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { removeUndefinedFields } from '@/lib/data-utils';

export default function ExpensesPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const expensesRef = useMemo(() => (user ? collection(firestore, 'users', user.uid, 'expenses') : null), [user, firestore]);
  const { data: rawExpenses, isLoading } = useCollection<Expense>(expensesRef);

  const expenses = useMemo(() => {
    if (!rawExpenses) return [];
    return rawExpenses.map(expense => ({
        ...expense,
        date: expense.date instanceof Timestamp ? expense.date.toDate() : expense.date,
    }));
  }, [rawExpenses]);

  const [budget] = useState(initialBudget);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (window.location.hash === '#add') {
      setIsDialogOpen(true);
    }
  }, []);

  const handleLogExpense = async (expenseData: Omit<Expense, 'id'>) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to log an expense.' });
      return;
    }
    try {
      const dataToAdd: { [key: string]: any } = {
        amount: expenseData.amount,
        category: expenseData.category,
        date: expenseData.date,
        createdAt: serverTimestamp(),
        notes: expenseData.notes,
      };
      
      const cleanData = removeUndefinedFields(dataToAdd);
      
      await addDoc(collection(firestore, 'users', user.uid, 'expenses'), cleanData);

      toast({ title: 'Success', description: 'Expense logged.' });
      (document.activeElement as HTMLElement)?.blur();
      setIsDialogOpen(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to log expense.' });
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
    </div>
  );
}
