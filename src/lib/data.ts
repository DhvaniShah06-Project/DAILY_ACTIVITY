import type { Task, Bill, Expense } from '@/lib/types';

// Mock data is no longer used for core features, but we keep the static budget structure for now.
// The app will now fetch live data from Firestore.
export const tasks: Task[] = [];
export const bills: Bill[] = [];
export const expenses: Expense[] = [];


export const budget = {
  total: 1000,
  categories: [
    { name: 'Grocery', total: 400 },
    { name: 'Transport', total: 150 },
    { name: 'Entertainment', total: 100 },
    { name: 'Bills', total: 250 },
    { name: 'Other', total: 100 },
  ],
};
