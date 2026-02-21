'use client';
import { Expense } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Wallet, ShoppingCart, Bus, Film, Receipt, HelpCircle } from 'lucide-react';

type ExpenseListProps = {
  expenses: Expense[];
};

const categoryIcons = {
  Grocery: ShoppingCart,
  Transport: Bus,
  Entertainment: Film,
  Bills: Receipt,
  Other: HelpCircle,
};

export function ExpenseList({ expenses }: ExpenseListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenses.map((expense) => {
            const Icon = categoryIcons[expense.category] || Wallet;
            return (
              <div key={expense.id} className="flex items-center gap-4">
                <div className="bg-muted p-3 rounded-lg">
                  <Icon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-grow">
                  <p className="font-semibold">{expense.category}</p>
                  <p className="text-sm text-muted-foreground">{expense.notes || format(expense.date, 'PPP')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">-${expense.amount.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
