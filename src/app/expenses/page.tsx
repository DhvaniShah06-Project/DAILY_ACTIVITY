'use client';
import { useState, useEffect, useMemo } from 'react';
import type { Expense } from '@/lib/types';
import { PlusCircle, Loader2 } from 'lucide-react';
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
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query } from 'firebase/firestore';

export default function ExpensesPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const expensesQuery = query(collection(db, 'users', user.uid, 'expenses'));
    const unsubscribe = onSnapshot(expensesQuery, (snapshot) => {
      const fetchedExpenses = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date?.toDate ? data.date.toDate() : new Date(),
        } as Expense;
      });
      setExpenses(fetchedExpenses.sort((a, b) => b.date.getTime() - a.date.getTime()));
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching expenses: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch expenses.' });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, db, toast]);


  useEffect(() => {
    if (window.location.hash === '#add') {
      setIsDialogOpen(true);
    }
  }, []);

  const handleLogExpense = async (expenseData: Omit<Expense, 'id'>) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
      return;
    }
    
    const dataToSave: { [key: string]: any } = {
      amount: expenseData.amount,
      category: expenseData.category,
      date: expenseData.date,
      createdAt: serverTimestamp(),
    };

    if (expenseData.notes) {
      dataToSave.notes = expenseData.notes;
    }

    try {
      await addDoc(collection(db, 'users', user.uid, 'expenses'), dataToSave);
      toast({ title: 'Success', description: 'Expense logged.' });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error logging expense:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to log expense.' });
    }
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
      
      {isLoading ? (
         <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
      ) : (
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
      )}
    </div>
  );
}
