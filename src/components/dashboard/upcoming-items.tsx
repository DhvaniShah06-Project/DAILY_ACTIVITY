import { tasks, bills } from '@/lib/data';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ListChecks, Receipt } from 'lucide-react';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { Button } from '../ui/button';

export function UpcomingItems() {
  const upcomingTasks = tasks
    .filter((task) => !task.isCompleted)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 3);

  const upcomingBills = bills
    .filter((bill) => bill.status === 'unpaid')
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Upcoming</CardTitle>
        <CardDescription>
          Here's what's next on your schedule.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              Tasks
            </h3>
            <Button variant="link" asChild className="text-primary">
              <Link href="/tasks">View All</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Due {format(task.dueDate, 'MMM d')}
                    </p>
                  </div>
                  <Badge variant="secondary">{task.category}</Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm p-3">No upcoming tasks.</p>
            )}
          </div>
        </div>
        <div>
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                Bills
                </h3>
                <Button variant="link" asChild className="text-primary">
                <Link href="/bills">View All</Link>
                </Button>
            </div>
          <div className="space-y-3">
            {upcomingBills.length > 0 ? (
              upcomingBills.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <p className="font-medium">{bill.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Due {format(bill.dueDate, 'MMM d')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${bill.amount.toFixed(2)}</p>
                    <Badge variant="destructive" className="mt-1">
                      {bill.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm p-3">No upcoming bills.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
