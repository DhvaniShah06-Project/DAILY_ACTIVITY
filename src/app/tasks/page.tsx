'use client';
import { useState, useEffect, useMemo } from 'react';
import type { Task } from '@/lib/types';
import { tasks as dummyTasks } from '@/lib/data';
import { PlusCircle, Loader2 } from 'lucide-react';
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
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp, onSnapshot, query, writeBatch } from 'firebase/firestore';

export default function TasksPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

   useEffect(() => {
    if (!user) {
      setTasks([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const tasksQuery = query(collection(db, 'users', user.uid, 'tasks'));
    const unsubscribe = onSnapshot(tasksQuery, async (snapshot) => {
      if (snapshot.empty && user) {
        // One-time seed for new users
        try {
          const batch = writeBatch(db);
          const tasksCol = collection(db, 'users', user.uid, 'tasks');
          dummyTasks.forEach((task) => {
            const docRef = doc(tasksCol);
            const { id, ...taskData } = task; // Destructure to remove the local id
            batch.set(docRef, { ...taskData, createdAt: serverTimestamp() });
          });
          await batch.commit();
        } catch (e) {
            console.error("Error seeding tasks: ", e);
             if (e instanceof Error) {
                toast({ variant: 'destructive', title: 'Seeding Error', description: `Could not pre-populate tasks: ${e.message}` });
            }
        }
      } else {
        const fetchedTasks = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : new Date(),
          } as Task;
        });
        setTasks(fetchedTasks);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching tasks: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch tasks.' });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, db, toast]);


  useEffect(() => {
    if (window.location.hash === '#add') {
      setIsDialogOpen(true);
    }
  }, []);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'isCompleted'>) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to add a task.',
      });
      return;
    }
    
    const dataToSave: { [key: string]: any } = {
      title: taskData.title,
      category: taskData.category,
      dueDate: taskData.dueDate,
      isCompleted: false,
      createdAt: serverTimestamp(),
    };

    if (taskData.ingredients && taskData.ingredients.length > 0) {
      dataToSave.ingredients = taskData.ingredients;
    }

    const collectionRef = collection(db, 'users', user.uid, 'tasks');
    addDoc(collectionRef, dataToSave)
      .then(() => {
        toast({ title: 'Success', description: 'Task added successfully.' });
        setIsDialogOpen(false);
      })
      .catch((error) => {
        console.error("Error adding task: ", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Could not add task. ${error instanceof Error ? error.message : ''}`,
        });
      });
  };

  const toggleTaskCompletion = (taskId: string) => {
    if (!user) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
    const updatedData = { isCompleted: !task.isCompleted };

    updateDoc(taskRef, updatedData)
      .catch((error) => {
        console.error("Error updating task: ", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Could not update task. ${error instanceof Error ? error.message : ''}`,
        });
      });
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
      
      {isLoading ? (
         <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
      ) : tasksForSelectedDate.length > 0 ? (
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
