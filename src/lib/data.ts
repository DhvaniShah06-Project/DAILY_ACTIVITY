import type { Task, Bill, Expense } from '@/lib/types';

// Mock data to be used throughout the application for a stable demo experience.

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Buy groceries for the week',
    category: 'Shopping',
    dueDate: new Date(),
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Prepare dinner: Pasta',
    category: 'Cooking',
    dueDate: new Date(),
    isCompleted: true,
    ingredients: ['pasta', 'tomato sauce', 'cheese'],
  },
  {
    id: '3',
    title: 'Clean the living room',
    category: 'Cleaning',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    isCompleted: false,
  },
];

export const bills: Bill[] = [
  {
    id: 'b1',
    name: 'Internet Bill',
    amount: 59.99,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    status: 'unpaid',
    category: 'Subscription',
  },
  {
    id: 'b2',
    name: 'Electricity Bill',
    amount: 75.4,
    dueDate: new Date(new Date().setDate(new Date().getDate() - 10)),
    status: 'paid',
    category: 'Utilities',
    paymentDate: new Date(new Date().setDate(new Date().getDate() - 9)),
  },
  {
    id: 'b3',
    name: 'Water Bill',
    amount: 35.0,
    dueDate: new Date(new Date().setDate(new Date().getDate() - 2)),
    status: 'unpaid',
    category: 'Utilities',
  },
];

export const expenses: Expense[] = [
  {
    id: 'e1',
    category: 'Grocery',
    amount: 85.6,
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    notes: 'Weekly shopping',
  },
  {
    id: 'e2',
    category: 'Transport',
    amount: 22.5,
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    notes: 'Gas for car',
  },
  {
    id: 'e3',
    category: 'Entertainment',
    amount: 40.0,
    date: new Date(new Date().setDate(new Date().getDate() - 3)),
    notes: 'Movie tickets',
  },
  {
    id: 'e4',
    category: 'Bills',
    amount: 75.4,
    date: new Date(new Date().setDate(new Date().getDate() - 9)),
    notes: 'Paid electricity bill',
  },
];

export const budget = {
  total: 1000,
  categories: [
    { name: 'Grocery', total: 400, spent: 85.6 },
    { name: 'Transport', total: 150, spent: 22.5 },
    { name: 'Entertainment', total: 100, spent: 40.0 },
    { name: 'Bills', total: 250, spent: 75.4 },
    { name: 'Other', total: 100, spent: 0 },
  ],
};
