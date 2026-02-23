'use client';
import { useState, useEffect, useMemo } from 'react';
import type { Task } from '@/lib/types';
import { tasks as dummyTasks } from '@/lib/data';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { TaskList } from './components/task-list';
import { TaskForm } from './components/task-form';
import { EmptyState } from '@/components/empty-state';
import { DateSelector } from './components/date-selector';
import { isSameDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function TasksPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate),
        }));
        setTasks(parsedTasks);
      } else {
        setTasks(dummyTasks);
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage", error);
      setTasks(dummyTasks);
    } finally {
      setIsInitialLoad(false);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, isInitialLoad]);

  useEffect(() => {
    if (window.location.hash === '#add') {
      setIsDialogOpen(true);
    }
  }, []);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'isCompleted'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      isCompleted: false,
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    toast({ title: 'Success', description: 'Task added successfully.' });
    setIsDialogOpen(false);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const tasksForSelectedDate = useMemo(() => tasks.filter((task) =>
    isSameDay(task.dueDate, selectedDate)
  ), [tasks, selectedDate]);

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
              <DialogDescription>
                Fill in the details below to add a new task to your list.
              </DialogDescription>
            </DialogHeader>
            <TaskForm
              onSubmit={handleAddTask}
              selectedDate={selectedDate}
              key={selectedDate.toISOString()}
            />
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
                <DialogDescription>
                  Fill in the details below to add a new task to your list.
                </DialogDescription>
              </DialogHeader>
              <TaskForm
                onSubmit={handleAddTask}
                selectedDate={selectedDate}
                key={selectedDate.toISOString()}
              />
            </DialogContent>
          </Dialog>
        </EmptyState>
      )}
    </div>
  );
}
