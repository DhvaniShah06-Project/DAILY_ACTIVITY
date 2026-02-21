'use client';
import { useState, useEffect } from 'react';
import type { Expense } from '@/lib/types';
import { expenses as initialExpenses, budget as initialBudget } from '@/lib/data';
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
} from '@/components/ui/dialog';
import { ExpenseForm } from './components/expense-form';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [budget, setBudget] = useState(initialBudget);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (window.location.hash === '#add') {
      setIsDialogOpen(true);
    }
  }, []);

  const handleLogExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expenseToAdd: Expense = {
      ...newExpense,
      id: Date.now().toString(),
    };
    setExpenses((prevExpenses) => [expenseToAdd, ...prevExpenses]);
    
    // Update budget
    setBudget(prevBudget => {
        const newCategories = prevBudget.categories.map(cat => {
            if (cat.name === newExpense.category) {
                return { ...cat, spent: cat.spent + newExpense.amount };
            }
            return cat;
        });
        return { ...prevBudget, categories: newCategories };
    });

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
            </DialogHeader>
            <ExpenseForm onSubmit={handleLogExpense} />
          </DialogContent>
        </Dialog>
      </div>

      <BudgetOverview budget={budget} />
      
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
                </DialogHeader>
                <ExpenseForm onSubmit={handleLogExpense} />
            </DialogContent>
          </Dialog>
        </EmptyState>
      )}
    </div>
  );
}
