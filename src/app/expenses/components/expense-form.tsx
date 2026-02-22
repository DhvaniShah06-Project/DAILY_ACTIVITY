'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import type { Expense } from '@/lib/types';

const expenseSchema = z.object({
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0.'),
  category: z.enum(['Grocery', 'Transport', 'Entertainment', 'Bills', 'Other']),
  notes: z.string().optional(),
  date: z.date(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

type ExpenseFormProps = {
  onSubmit: (data: Omit<Expense, 'id'>) => void;
};

export function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      category: 'Grocery',
      notes: '',
      date: new Date(),
    },
  });

  const handleFormSubmit = (data: ExpenseFormValues) => {
    const { amount, category, date, notes } = data;
    
    let expenseData: Omit<Expense, 'id'>;

    if (notes && notes.trim()) {
      expenseData = {
        amount,
        category,
        date,
        notes,
      };
    } else {
      expenseData = {
        amount,
        category,
        date,
      };
    }
    
    onSubmit(expenseData);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  <SelectItem value="Grocery">Grocery</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Bills">Bills</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Weekly groceries at store" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Log Expense
        </Button>
      </form>
    </Form>
  );
}
