'use client';
import { useState, useEffect, useMemo } from 'react';
import type { Task } from '@/lib/types';
import { Loader2, PlusCircle } from 'lucide-react';
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
import { useUser, useFirestore } from '@/firebase';
import { useCollection, WithId } from '@/firebase/firestore/use-collection';
import { collection, query, Timestamp } from 'firebase/firestore';
import { addTask, updateTaskCompletion } from '@/lib/firebase/db';
import { useToast } from '@/hooks/use-toast';

export default function TasksPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const tasksRef = useMemo(
    () => (user ? collection(firestore, 'users', user.uid, 'tasks') : null),
    [user?.uid, firestore]
  );
  
  const { data: rawTasks, isLoading: tasksLoading } = useCollection<Task>(tasksRef);

  const tasks = useMemo(() => {
    if (!rawTasks) return [];
    return rawTasks.map(task => ({
        ...task,
        dueDate: task.dueDate instanceof Timestamp ? task.dueDate.toDate() : task.dueDate,
    }));
  }, [rawTasks]);
  

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  useEffect(() => {
    if (window.location.hash === '#add') {
      setIsDialogOpen(true);
    }
  }, []);

  const handleAddTask = async (newTask: Omit<Task, 'id' | 'isCompleted'>) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to add a task.' });
      return;
    }
    try {
      await addTask(firestore, user.uid, newTask);
      toast({ title: 'Success', description: 'Task added successfully.' });
      setIsDialogOpen(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add task.' });
      console.error(error);
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    if (!user) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    try {
      await updateTaskCompletion(firestore, user.uid, taskId, !task.isCompleted);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update task.' });
      console.error(error);
    }
  };
  
  const pageIsLoading = !selectedDate || tasksLoading;

  if (pageIsLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
