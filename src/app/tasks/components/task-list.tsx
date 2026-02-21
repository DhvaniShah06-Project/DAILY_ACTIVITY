'use client';

import { Task } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type TaskListProps = {
  tasks: Task[];
  onToggleCompletion: (taskId: string) => void;
};

export function TaskList({ tasks, onToggleCompletion }: TaskListProps) {
  const pendingTasks = tasks.filter((task) => !task.isCompleted);
  const completedTasks = tasks.filter((task) => task.isCompleted);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-headline mb-4">Pending</h2>
        <div className="space-y-3">
          {pendingTasks.length > 0 ? (
            pendingTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleCompletion={onToggleCompletion}
              />
            ))
          ) : (
            <p className="text-muted-foreground">No pending tasks. Well done!</p>
          )}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold font-headline mb-4">Completed</h2>
        <div className="space-y-3">
          {completedTasks.length > 0 ? (
            completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleCompletion={onToggleCompletion}
              />
            ))
          ) : (
            <p className="text-muted-foreground">No tasks completed yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskItem({
  task,
  onToggleCompletion,
}: {
  task: Task;
  onToggleCompletion: (taskId: string) => void;
}) {
  return (
    <Card
      className={cn(
        'transition-all',
        task.isCompleted && 'bg-muted/50'
      )}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.isCompleted}
          onCheckedChange={() => onToggleCompletion(task.id)}
          className="h-6 w-6"
        />
        <div className="flex-grow">
          <label
            htmlFor={`task-${task.id}`}
            className={cn(
              'font-medium cursor-pointer',
              task.isCompleted && 'line-through text-muted-foreground'
            )}
          >
            {task.title}
          </label>
          <p
            className={cn(
              'text-sm text-muted-foreground',
              task.isCompleted && 'line-through'
            )}
          >
            Due: {format(task.dueDate, 'PPP')}
          </p>
        </div>
        <Badge variant={task.isCompleted ? 'outline' : 'secondary'}>
          {task.category}
        </Badge>
      </CardContent>
    </Card>
  );
}
