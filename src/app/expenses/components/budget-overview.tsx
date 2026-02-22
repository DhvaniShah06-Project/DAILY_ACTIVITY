'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Expense } from '@/lib/types';
import { useMemo } from 'react';

type BudgetData = {
  total: number;
  categories: {
    name: string;
    total: number;
  }[];
};

type BudgetOverviewProps = {
  budget: BudgetData;
  expenses: Expense[];
};

export function BudgetOverview({ budget, expenses }: BudgetOverviewProps) {
  const categorySpending = useMemo(() => {
    const spendingMap = new Map<string, number>();
    for (const expense of expenses) {
      spendingMap.set(expense.category, (spendingMap.get(expense.category) || 0) + expense.amount);
    }
    return spendingMap;
  }, [expenses]);
  
  const totalSpent = useMemo(() => {
    return expenses.reduce((acc, expense) => acc + expense.amount, 0);
  }, [expenses]);
  
  const totalBudget = budget.total;
  const overallProgress = (totalSpent / totalBudget) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Budget Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="font-semibold">Overall Budget</span>
            <span className="font-semibold">
              ${totalSpent.toFixed(2)} / ${totalBudget.toFixed(2)}
            </span>
          </div>
          <Progress value={overallProgress} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {budget.categories.map((category) => {
            const spent = categorySpending.get(category.name) || 0;
            const progress = (spent / category.total) * 100;
            return (
              <div key={category.name}>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="font-medium">{category.name}</span>
                  <span className="text-muted-foreground">
                    ${spent.toFixed(2)} / ${category.total.toFixed(2)}
                  </span>
                </div>
                <Progress value={progress} />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
