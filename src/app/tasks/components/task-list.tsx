'use client';

import { Task } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format, isPast, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

type TaskListProps = {
  tasks: Task[];
  onToggleCompletion: (taskId: string) => void;
};

export function TaskList({ tasks, onToggleCompletion }: TaskListProps) {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isCompleted === b.isCompleted) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    return a.isCompleted ? 1 : -1;
  });

  return (
    <div className="space-y-3">
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleCompletion={onToggleCompletion}
        />
      ))}
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
  const isOverdue = !task.isCompleted && isPast(task.dueDate) && !isToday(task.dueDate);

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
              'text-sm',
              task.isCompleted
                ? 'text-muted-foreground line-through'
                : isOverdue
                ? 'text-destructive'
                : 'text-muted-foreground'
            )}
          >
            {isOverdue ? 'Overdue: ' : 'Due: '}
            {format(task.dueDate, 'PPP')}
          </p>
        </div>
        <Badge variant={task.isCompleted ? 'outline' : 'secondary'}>
          {task.category}
        </Badge>
      </CardContent>
    </Card>
  );
}
