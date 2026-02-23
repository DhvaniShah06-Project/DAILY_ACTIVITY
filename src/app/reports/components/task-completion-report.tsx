'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Task } from '@/lib/types';

type TaskCompletionReportProps = {
    tasks: Task[];
}

export function TaskCompletionReport({ tasks }: TaskCompletionReportProps) {
  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const totalTasks = tasks.length;
  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Productivity</CardTitle>
        <CardDescription>Your task completion stats.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-[244px]">
        {totalTasks > 0 ? (
            <>
                <div
                className="relative h-40 w-40 rounded-full flex items-center justify-center"
                style={{
                    background: `conic-gradient(hsl(var(--primary)) ${completionRate}%, hsl(var(--muted)) 0)`,
                }}
                >
                <div className="absolute h-32 w-32 rounded-full bg-card flex items-center justify-center flex-col">
                    <span className="text-4xl font-bold">
                    {completionRate.toFixed(0)}%
                    </span>
                    <span className="text-sm text-muted-foreground">Completed</span>
                </div>
                </div>
                <p className="mt-4 text-center text-muted-foreground">
                You've completed {completedTasks} of {totalTasks} tasks.
                </p>
            </>
        ) : (
            <p className="text-muted-foreground">No task data available.</p>
        )}
      </CardContent>
    </Card>
  );
}
