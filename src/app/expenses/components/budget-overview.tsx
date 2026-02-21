'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type BudgetOverviewProps = {
  budget: {
    total: number;
    categories: {
      name: string;
      spent: number;
      total: number;
    }[];
  };
};

export function BudgetOverview({ budget }: BudgetOverviewProps) {
  const totalSpent = budget.categories.reduce((acc, cat) => acc + cat.spent, 0);
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
            const progress = (category.spent / category.total) * 100;
            return (
              <div key={category.name}>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="font-medium">{category.name}</span>
                  <span className="text-muted-foreground">
                    ${category.spent.toFixed(2)} / ${category.total.toFixed(2)}
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
