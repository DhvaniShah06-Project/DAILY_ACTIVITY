import { tasks } from '@/lib/data';
import { isToday } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { Button } from '../ui/button';

export function UpcomingItems() {
  const todaysTasks = tasks
    .filter((task) => isToday(task.dueDate) && !task.isCompleted)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="font-headline">Today's Tasks</CardTitle>
            <Button variant="link" asChild className="text-primary -mr-4">
              <Link href="/tasks">View All</Link>
            </Button>
        </div>
        <CardDescription>
          Here's what you need to get done today.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
          {todaysTasks.length > 0 ? (
            todaysTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Due Today
                  </p>
                </div>
                <Badge variant="secondary">{task.category}</Badge>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm p-3 text-center">No tasks for today. Enjoy your day!</p>
          )}
      </CardContent>
    </Card>
  );
}
