'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Sparkles, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  category: z.enum(['Cooking', 'Cleaning', 'Shopping', 'Other']),
  dueDate: z.date({ required_error: 'A due date is required.' }),
  ingredients: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

type TaskFormProps = {
  onSubmit: (data: Omit<Task, 'id' | 'isCompleted'>) => void;
  selectedDate?: Date;
};

export function TaskForm({ onSubmit, selectedDate }: TaskFormProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      category: 'Cooking',
      dueDate: selectedDate || new Date(),
      ingredients: '',
    },
  });
  const { toast } = useToast();
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const category = form.watch('category');
  const ingredients = form.watch('ingredients');

  const handleGetSuggestions = async () => {
    if (!ingredients) {
      toast({
        variant: 'destructive',
        title: 'Ingredients needed',
        description: 'Please enter some ingredients to get suggestions.',
      });
      return;
    }
    setIsSuggesting(true);
    setSuggestions([]);
    try {
      const payload = {
        ingredients: ingredients.split(',').map((i) => i.trim()),
        timeOfDay: 'Dinner',
      };
      
      const response = await fetch('/api/ai/dishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI suggestions from API.');
      }

      const result = await response.json();
      setSuggestions(result.dishNames);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch AI suggestions.',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleFormSubmit = (data: TaskFormValues) => {
    const taskData: Omit<Task, 'id' | 'isCompleted'> = {
      title: data.title,
      category: data.category,
      dueDate: data.dueDate,
    };

    if (data.ingredients && data.ingredients.trim().length > 0) {
      taskData.ingredients = data.ingredients.split(',').map((i) => i.trim()).filter(i => i.length > 0);
    }

    onSubmit(taskData);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Pay electricity bill" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <FormLabel>Suggestions</FormLabel>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((name) => (
                <Button
                  key={name}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => form.setValue('title', name)}
                >
                  {name}
                </Button>
              ))}
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Cooking">Cooking</SelectItem>
                  <SelectItem value="Cleaning">Cleaning</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {category === 'Cooking' && (
          <FormField
            control={form.control}
            name="ingredients"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ingredients</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Textarea
                      placeholder="e.g., chicken, tomatoes, onion"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={handleGetSuggestions}
                    disabled={isSuggesting || !ingredients}
                  >
                    {isSuggesting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    <span>Suggest Dish</span>
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'MMMM do, yyyy')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Add Task
        </Button>
      </form>
    </Form>
  );
}
