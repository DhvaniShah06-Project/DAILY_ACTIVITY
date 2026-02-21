'use client';
import { useState, useEffect } from 'react';
import type { Task } from '@/lib/types';
import { tasks as initialTasks } from '@/lib/data';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TaskList } from './components/task-list';
import { TaskForm } from './components/task-form';
import { EmptyState } from '@/components/empty-state';
import { DateSelector } from './components/date-selector';
import { isSameDay } from 'date-fns';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (window.location.hash === '#add') {
      setIsDialogOpen(true);
    }
  }, []);

  const handleAddTask = (newTask: Omit<Task, 'id' | 'isCompleted'>) => {
    const taskToAdd: Task = {
      ...newTask,
      id: Date.now().toString(),
      isCompleted: false,
    };
    setTasks((prevTasks) =>
      [...prevTasks, taskToAdd].sort(
        (a, b) => a.dueDate.getTime() - b.dueDate.getTime()
      )
    );
    setIsDialogOpen(false);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const tasksForSelectedDate = tasks.filter((task) =>
    isSameDay(task.dueDate, selectedDate)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">My Tasks</h1>
          <p className="text-muted-foreground">
            Manage your daily chores and to-do lists.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline">Add a new task</DialogTitle>
            </DialogHeader>
            <TaskForm onSubmit={handleAddTask} />
          </DialogContent>
        </Dialog>
      </div>

      <DateSelector
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {tasksForSelectedDate.length > 0 ? (
        <TaskList
          tasks={tasksForSelectedDate}
          onToggleCompletion={toggleTaskCompletion}
        />
      ) : (
        <EmptyState
          title="No tasks for this day!"
          description="Enjoy your day or add a new task."
          imageSrc="https://picsum.photos/seed/empty-tasks-day/400/300"
          imageAlt="Empty task list for the day"
          imageHint="relaxing beach"
        >
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-headline">
                  Add a new task
                </DialogTitle>
              </DialogHeader>
              <TaskForm onSubmit={handleAddTask} />
            </DialogContent>
          </Dialog>
        </EmptyState>
      )}
    </div>
  );
}
