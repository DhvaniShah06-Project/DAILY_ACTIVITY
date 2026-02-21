import { tasks, bills, budget } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks, Receipt, Wallet } from 'lucide-react';
import { isToday } from 'date-fns';
import { Progress } from '@/components/ui/progress';

export function SummaryCards() {
  const tasksToday = tasks.filter(
    (task) => isToday(task.dueDate) && !task.isCompleted
  ).length;

  const billsDue = bills.filter((bill) => bill.status === 'unpaid').length;
  
  const totalSpent = budget.categories.reduce((acc, cat) => acc + cat.spent, 0);
  const budgetProgress = (totalSpent / budget.total) * 100;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-headline text-base font-medium flex items-center justify-between">
                <span>Tasks Today</span>
                <ListChecks className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{tasksToday}</p>
            <p className="text-xs text-muted-foreground">pending for today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-headline text-base font-medium flex items-center justify-between">
                <span>Bills Due</span>
                <Receipt className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{billsDue}</p>
            <p className="text-xs text-muted-foreground">unpaid bills</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-headline text-base font-medium flex items-center justify-between">
                <span>Budget This Month</span>
                <Wallet className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalSpent.toFixed(2)} <span className="text-base text-muted-foreground">/ ${budget.total.toFixed(2)}</span></p>
            <Progress value={budgetProgress} indicatorClassName="bg-accent" className="h-2 mt-2" />
          </CardContent>
        </Card>
    </div>
  );
}
